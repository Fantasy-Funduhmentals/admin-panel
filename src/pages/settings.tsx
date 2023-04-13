import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsPassword } from "../components/settings/settings-password";
import MaintenanceMode from "../components/MaintenanceMode/toggle";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import Betting from "../components/settings/betting";
import TermAndConditions from "../components/termAndConditions/termAndConditions";
const Settings = () => (
  <>
    <Head>
      <title>Settings</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Box sx={{ ml: 5, mr: 5 }}>
        <Typography sx={{ mb: 3 }} variant="h4">
          Settings
        </Typography>
        <Box sx={{ pt: 3 }}>
          <MaintenanceMode />
        </Box>

        <Box sx={{ pt: 3 }}>
          <PrivacyPolicy />
        </Box>

        <Box sx={{ pt: 3 }}>
          <TermAndConditions />
        </Box>
        <Box sx={{ pt: 3 }}>
          <Betting />
        </Box>
        <Box sx={{ pt: 3 }}>
          <SettingsPassword />
        </Box>
      </Box>
    </Box>
  </>
);

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
