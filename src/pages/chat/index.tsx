import { Card, Container } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { SocketContext } from "../../context/socket";
import { useAppDispatch } from "../../store/hooks";
import { saveChats } from "../../store/reducers/chatSlice";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";

const Chat = () => {
  const socket: Socket = useContext(SocketContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit(CHAT_SOCKET_TYPES.ALL_ROOMS_LISTING, { userId: "ADMIN" });

    socket.on(CHAT_SOCKET_TYPES.ALL_ROOMS, (data) => {
      dispatch(saveChats(data));
    });

    socket.on("connect_error", (err) => {
      console.log("--error connecting to socket--", err);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <Page title="Chat">
      <Container>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: "Dashboard" }, { name: "Chat" }]}
        />
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
