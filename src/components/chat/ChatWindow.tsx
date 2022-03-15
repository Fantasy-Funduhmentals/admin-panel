import { Box, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import { addRecipients, onSendMessage } from "../../store/reducers/chatSlice";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import { getOtherUser } from "../../utils/helpers";
import ChatHeaderCompose from "./ChatHeaderCompose";
import ChatHeaderDetail from "./ChatHeaderDetail";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import ChatRoom from "./ChatRoom";

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId
    ? conversations.byId[activeConversationId]
    : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: "",
    messages: [],
    participants: [],
    unreadCount: 0,
    type: "",
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const { pathname, query } = useRouter();

  const { chats, currentChatRoom } = useSelector(
    (state: RootState) => state.chat
  );

  const { conversationKey } = query;

  const [currentChat, otherUser] = useMemo(() => {
    const current = chats?.find(
      (item: any) => item?.chatRoomId == conversationKey
    );

    let otherUser;
    if (current) {
      otherUser = getOtherUser(current?.members);
    }
    return [current, otherUser];
  }, [conversationKey]);

  const { contacts, recipients, participants, activeConversationId } =
    useSelector((state: RootState) => state.chat);

  const mode = conversationKey ? "DETAIL" : "COMPOSE";

  const listeners = useCallback(async () => {
    if (otherUser) {
      console.log("--listeners initialized---");

      socket.emit(CHAT_SOCKET_TYPES.ENTER_CHAT_ROOM, {
        userId: "ADMIN",
        otherUserId: otherUser?._id,
        chatRoomId: conversationKey,
      });

      socket.on(CHAT_SOCKET_TYPES.ALL_MESSAGES, (data: any) => {
        console.log("--messages all----", data);
        setMessages(data.messages);
      });

      socket.on(CHAT_SOCKET_TYPES.NEW_MESSAGE, (msg: any) => {
        let index = messages.findIndex((data: any) => data._id == msg._id);

        if (index == -1) {
          console.log("--new message received---", msg);
          // setMessages()
          setMessages((previousArr: any[]) => [...previousArr, msg]);
        }
      });
    }
  }, [otherUser]);

  useEffect(() => {
    listeners();
  }, []);

  const handleAddRecipients = (recipients) => {
    dispatch(addRecipients(recipients));
  };

  const handleSendMessage = async (value) => {
    socket.emit("add-message", {
      text: value,
      user: "ADMIN",
      recipient: otherUser._id,
      chatRoom: conversationKey,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {mode === "DETAIL" ? (
        <ChatHeaderDetail participants={[otherUser]} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          <ChatMessageList conversation={messages} />

          <Divider />

          <ChatMessageInput
            conversationId={currentChatRoom?.chatRoomId}
            onSend={handleSendMessage}
          />
        </Box>

        {mode === "DETAIL" && (
          <ChatRoom conversation={otherUser} participants={[otherUser]} />
        )}
      </Box>
    </Box>
  );
}
