import { Box, Card, Container } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetAdminState } from "../../store/reducers/adminSlice";
import { saveChats, updateChatRoom } from "../../store/reducers/chatSlice";
import { resetCoinState } from "../../store/reducers/coinSlice";
import { resetCompleteDirectWireState } from "../../store/reducers/completeDirectWire";
import { resetEmailState } from "../../store/reducers/emailSlice";
import { resetRequestState } from "../../store/reducers/requestSlice";
import { resetSettingsState } from "../../store/reducers/settingsSlice";
import { resetUserState } from "../../store/reducers/userSlice";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import Router from "next/router";
import StatusModal from "../../components/StatusModal";
const Chat = () => {
  const socket: Socket = useContext(SocketContext);
  const [statusData, setStatusData] = useState(null);
  const { email } = useAppSelector((state: RootState) => state.email);
  const handleLogout = () => {
    dispatch(resetUserState());
    dispatch(resetAdminState());
    dispatch(resetCoinState());
    dispatch(resetCompleteDirectWireState());
    dispatch(resetRequestState());
    dispatch(resetSettingsState());
    dispatch(resetCompleteDirectWireState());
    dispatch(resetEmailState());
    Router.push("/login");
  };
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
    socket.on(email, (data) => {
      if (data.user.isBlocked == true) {
        setStatusData({
          type: "error",
          message: "Your Blocked",
        });
        handleLogout();
        return;
      }
    });

    socket.on(CHAT_SOCKET_TYPES.CHAT_ROOM_CHANGED, (data: any) => {
      if (data) {
        dispatch(updateChatRoom(updateChatRoom(data)));
      }
    });

    socket.on("connect_error", (err) => {});
  }, []);

  useEffect(() => {
    listeners();
    return () => {
      // socket.removeAllListeners();
    };
  }, []);

  return (
    <>
      <Page title="Chat Support">
        <Container maxWidth={false}>
          <HeaderBreadcrumbs heading="Chat Support" />
          <Card sx={{ height: "72vh", display: "flex" }}>
            <ChatSidebar />
            <ChatWindow />
          </Card>
        </Container>
      </Page>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

Chat.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Chat;
