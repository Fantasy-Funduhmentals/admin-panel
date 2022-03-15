import { Card, Container } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";

import { ChatSidebar, ChatWindow } from "../../components/chat";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";

// Chat.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default function ChatDetails() {
  const dispatch = useAppDispatch();

  useEffect(() => {}, [dispatch]);

  return (
    <Page title="Chat Support">
      <Container maxWidth={"xl"}>
        <HeaderBreadcrumbs
          heading="Chat Support"
          links={[{ name: "Dashboard" }, { name: "Chat Support" }]}
        />
        <Card sx={{ height: "72vh", display: "flex" }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
