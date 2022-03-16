import { Card, Container } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import { saveChats } from "../../store/reducers/chatSlice";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";

const Chat = () => {
  const socket: Socket = useContext(SocketContext);
  const { chats } = useSelector((state: RootState) => state.chat);

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.emit(CHAT_SOCKET_TYPES.ALL_ROOMS_LISTING, { userId: "ADMIN" });
    socket.emit(CHAT_SOCKET_TYPES.USER_CONNECT, { userId: "ADMIN" });

    socket.on(CHAT_SOCKET_TYPES.ALL_ROOMS, (data) => {
      data = data.sort(function (a: any, b: any) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      dispatch(saveChats(data));
    });

    socket.on(CHAT_SOCKET_TYPES.CHAT_ROOM_CHANGED, (data: any) => {
      let chatTemp = [...chats];
      let index = chatTemp.findIndex((chat) => chat._id == data._id);
      chatTemp[index] = data;

      chatTemp = chatTemp.sort(function (a: any, b: any) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      dispatch(saveChats(chatTemp));
    });

    socket.on("connect_error", (err) => {
      console.log("--error connecting to socket--", err);
    });

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
