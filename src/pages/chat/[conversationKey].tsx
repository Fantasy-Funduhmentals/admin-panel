import {Card, Container } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";

// ----------------------------------------------------------------------

Chat.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default function Chat() {
  // const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  return (
   <>
    <Page title="Chat">
      {/* <Container maxWidth={themeStretch ? false : "xl"}> */}
      <Container maxWidth={false}>
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
   </>
  );
}
