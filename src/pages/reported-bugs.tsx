import { Box, Container } from "@mui/material";
import Head from "next/head";
import { resetWarningCache } from "prop-types";
import { useEffect, useState } from "react";
import { BugsList } from "../components/BugsManagement/bugsList";
import DetailsModal from "../components/BugsManagement/Details-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { getAdminUserData } from "../services/tokenService";
import { getAllBugsReport } from "../services/userService";
import { useAppDispatch } from "../store/hooks";
import { saveAdminUser } from "../store/reducers/adminSlice";
import { resetUserState } from "../store/reducers/userSlice";
import { getNormalizedError } from "../utils/helpers";

const ReportedBugs = () => {
  const dispatch = useAppDispatch();
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [editSubAdmin, setEditSubAdmin] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [data, setData] = useState();
  const [reload, setReload] = useState(false);

  const OpenAddUserModal = (userData: any) => {
    setUserModalOpen(!userModelOpen);
    setEditSubAdmin(userData);
  };

  const getAllReportedBugs = async () => {
    try {
      setLoadingApi(true);
      const res = await getAllBugsReport();
      setData(res?.data?.reverse());

      setLoadingApi(false);
    } catch (err) {
      setLoadingApi(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllReportedBugs();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Bugs Management</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <ListToolbar
              title="Bugs Management"
              subTitle="Bugs"
              onChangeText={(ev) => {
                setSearchText(ev.target.value);
              }}
              style={{ width: "100%" }}
              handleRefresh={getAllReportedBugs}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <BugsList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAllReportedBugs}
              searchQuery={searchText}
              onPressUpdate={OpenAddUserModal}
              style={{ width: "100%" }}
              data={data}
            />
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />

      <DetailsModal
        open={userModelOpen}
        editData={editSubAdmin}
        onClose={() => {
          setUserModalOpen(false);
          setEditSubAdmin(null);
          setReload(!reload);
        }}
      />
    </>
  );
};
ReportedBugs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReportedBugs;
