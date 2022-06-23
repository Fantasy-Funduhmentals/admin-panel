import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import AddSubAdminModal from "../components/add-subadmin-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { AdminsList } from "../components/sub-admin/sub-admin";
import StatusModal from "../components/StatusModal";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveAdminUser } from "../store/reducers/adminSlice";
import { getNormalizedError } from "../utils/helpers";
import Button from "@mui/material/Button";
import { getAdminUserData } from "../services/tokenService";

const SubAdmin = () => {
  const { subadmin } = useAppSelector((state: RootState) => state.adminUser);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const OpenAddUserModal = () => {
    setUserModalOpen(!userModelOpen);
  };

  const getAdminUsers = async () => {
    try {
      setLoading(true);
      const AdminUser = await getAdminUserData();

      dispatch(saveAdminUser(AdminUser.data));
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
        <title>Sub - Admin</title>
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
            <Button variant="contained" onClick={OpenAddUserModal}>
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
            {loading ? (
              <CircularProgress />
            ) : (
              <AdminsList
                data={subadmin}
                handleRefresh={getAdminUsers}
                searchQuery={searchText}
                style={{ width: "100%" }}
              />
            )}
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
      <AddSubAdminModal
        open={userModelOpen}
        onClose={() => {
          setUserModalOpen(false);
          setReload(!reload);
        }}
      />
    </>
  );
};
SubAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubAdmin;