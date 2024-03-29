import { Box, Divider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../context/socket";
import { uploadImage } from "../../services/generalService";
import { RootState } from "../../store";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import { getOtherUser } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import ChatHeaderDetail from "./ChatHeaderDetail";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import ChatRoom from "./ChatRoom";

export default function ChatWindow() {
  const socket: Socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);
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
          socket.emit(CHAT_SOCKET_TYPES.CLEAR_RECENT_MESSAGE, {
            userId: "ADMIN",
            otherUserId: otherUser?._id,
            chatRoomId: conversationKey,
          });
        }
      });
    }
  }, [otherUser]);

  useEffect(() => {
    listeners();

    return () => {
      setMessages([]);
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

  const handleImageSend = async (event: any) => {
    setloading(true)
    if (
      !(
        event.target.files[0]?.type == "image/jpeg" ||
        event.target.files[0]?.type == "image/jpg" ||
        event.target.files[0]?.type == "image/png"
      )
    ) {
      setStatusData({
        type: "error",
        message: "Please select image only",
      });
      return;
    }
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      const formData = new FormData();

      formData.append("file", img);
      formData.append("type", "chat");

      const uploadRes = await uploadImage(formData);

      socket.emit("add-message", {
        text: "",
        user: "ADMIN",
        image: uploadRes?.data.url,
        recipient: otherUser?._id,
        chatRoom: conversationKey,
      });
    }
    setloading(false)
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {otherUser && <ChatHeaderDetail participant={otherUser} />}
      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          {otherUser && (
            <ChatMessageList conversation={messages} otherUser={otherUser} />
          )}

          {!otherUser && (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5">
                Please select a chat to continue
              </Typography>
            </Box>
          )}

          <Divider />

          {otherUser && (
            <ChatMessageInput
              conversationId={currentChatRoom?.chatRoomId}
              onSend={handleSendMessage}
              onImageReceived={handleImageSend}
              loading={loading}
            />
          )}
        </Box>

        {mode === "DETAIL" && (
          <ChatRoom conversation={otherUser} participants={[otherUser]} />
        )}
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Box>
  );
}
