import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsPassword } from "../components/settings/settings-password";

const Settings = () => (
  <>
    <Head>
      <title>Settings | CQR Admin</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Box sx={{ml:5,mr:5}}>
        <Typography sx={{ mb: 3 }} variant="h4">
          Settings
        </Typography>

        <Box sx={{ pt: 3}}>
          <SettingsPassword />
        </Box>
      </Box>
    </Box>
  </>
);

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
