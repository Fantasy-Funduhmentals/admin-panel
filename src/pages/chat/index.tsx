import { Card, Container } from "@mui/material";
import React, { useCallback, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import { saveChats, updateChatRoom } from "../../store/reducers/chatSlice";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";

const Chat = () => {
  const socket: Socket = useContext(SocketContext);

  const dispatch = useAppDispatch();

  const listeners = useCallback(async () => {
    socket.emit(CHAT_SOCKET_TYPES.ALL_ROOMS_LISTING, { userId: "ADMIN" });
    socket.emit(CHAT_SOCKET_TYPES.USER_CONNECT, { userId: "ADMIN" });

    socket.on(CHAT_SOCKET_TYPES.ALL_ROOMS, (data) => {
      if (data) {
        let temp = [...data];

        temp = temp?.sort((a: any, b: any) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        dispatch(saveChats(temp));
      }
    });

    socket.on(CHAT_SOCKET_TYPES.CHAT_ROOM_CHANGED, (data: any) => {
      if (data) {
        dispatch(updateChatRoom(updateChatRoom(data)));
      }
    });

    socket.on("connect_error", (err) => {
      console.log("--error connecting to socket--", err);
    });
  }, []);

  useEffect(() => {
    listeners();

    return () => {
      console.log("--listeners removed---");
      // socket.removeAllListeners();
    };
  }, []);

  return (
    <Page title="Chat Support">
      <Container>
        <HeaderBreadcrumbs heading="Chat Support" />
        <Card sx={{ height: "72vh", display: "flex" }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
};

Chat.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Chat;
