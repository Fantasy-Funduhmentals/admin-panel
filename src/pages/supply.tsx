import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { DistributeNft } from "../components/supply/supply";

const Settings = () => (
  <>
    <Head>
      <title>Distribute | CQR Admin</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          {/* Supply */}
        </Typography>

        <Box sx={{ pt: 3 }}>
          <DistributeNft />
        </Box>
      </Container>
    </Box>
  </>
);

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
