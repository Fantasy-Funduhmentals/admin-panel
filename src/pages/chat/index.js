import { Card, Container } from "@mui/material";
import { ChatSidebar, ChatWindow } from "../../components/chat";
import { DashboardLayout } from "../../components/dashboard-layout";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";

const Chat = () => {
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
