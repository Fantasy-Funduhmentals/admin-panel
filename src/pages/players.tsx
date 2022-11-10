import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { PlayerList } from "../components/PlayersComponent/playerData";
import UpdatePlayerModal from "../components/PlayersComponent/updatePlayers/update-player-modal";
import StatusModal from "../components/StatusModal";
import { AdminsList } from "../components/sub-admin/sub-admin";
import UpdateSubAdminModal from "../components/sub-admin/updateSubAdmin/update-subadmin-modal";
import { getAdminUserData } from "../services/tokenService";
import { useAppDispatch } from "../store/hooks";
import { saveAdminUser } from "../store/reducers/adminSlice";
import { getNormalizedError } from "../utils/helpers";

const SubAdmin = () => {
  const dispatch = useAppDispatch();
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [editSubAdmin, setEditSubAdmin] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  const OpenAddUserModal = (userData: any) => {
    setUserModalOpen(!userModelOpen);
    setEditSubAdmin(userData);
  };

  const getAdminUsers = async () => {
    try {
      setLoadingApi(true);
      const AdminUser = await getAdminUserData();
      dispatch(saveAdminUser(AdminUser?.data));
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
    getAdminUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Players </title>
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
            <Button variant="contained" onClick={() => setUserModalOpen(true)}>
              Add Sub Admin
            </Button>
            <ListToolbar
              title="Sub Admin Management"
              subTitle="Sub Admin User"
              onChangeText={(ev) => {
                setSearchText(ev.target.value);
              }}
              style={{ width: "100%" }}
              handleRefresh={getAdminUsers}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <PlayerList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAdminUsers}
              searchQuery={searchText}
              onPressUpdate={OpenAddUserModal}
              style={{ width: "100%" }}
            />
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />

      <UpdatePlayerModal
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
SubAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubAdmin;
