import { Box, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import { getOtherUser } from "../../utils/helpers";
import ChatHeaderDetail from "./ChatHeaderDetail";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import ChatRoom from "./ChatRoom";

export default function ChatWindow() {
  const socket: Socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const { query } = useRouter();

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

  const mode = conversationKey ? "DETAIL" : "COMPOSE";

  const listeners = useCallback(async () => {
    if (otherUser) {
      socket.emit(CHAT_SOCKET_TYPES.ENTER_CHAT_ROOM, {
        userId: "ADMIN",
        otherUserId: otherUser?._id,
        chatRoomId: conversationKey,
      });

      socket.on(CHAT_SOCKET_TYPES.ALL_MESSAGES, (data: any) => {
        setMessages(data.messages);
      });

      socket.on(CHAT_SOCKET_TYPES.NEW_MESSAGE, (msg: any) => {
        let index = messages.findIndex((data: any) => data._id == msg._id);

        if (index == -1 && msg.chatRoom == conversationKey) {
          setMessages((previousArr: any[]) => [...previousArr, msg]);
        }
      });
    }
  }, [otherUser]);

  useEffect(() => {
    listeners();

    return () => {
      socket.removeListener(CHAT_SOCKET_TYPES.ALL_MESSAGES);
      socket.removeListener(CHAT_SOCKET_TYPES.NEW_MESSAGE);
    };
  }, [otherUser]);

  const handleSendMessage = async (value: string) => {
    socket.emit("add-message", {
      text: value,
      user: "ADMIN",
      recipient: otherUser?._id,
      chatRoom: conversationKey,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {otherUser && <ChatHeaderDetail participant={otherUser} />}
      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          <ChatMessageList conversation={messages} otherUser={otherUser} />

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
