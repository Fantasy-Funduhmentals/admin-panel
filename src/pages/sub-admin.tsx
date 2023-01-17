import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { AdminsList } from "../components/sub-admin/sub-admin";
import UpdateSubAdminModal from "../components/sub-admin/updateSubAdmin/update-subadmin-modal";
import { getAdminUserData } from "../services/tokenService";
import { useAppDispatch } from "../store/hooks";
import { saveAdminUser } from "../store/reducers/adminSlice";
import { getNormalizedError } from "../utils/helpers";
<<<<<<< HEAD
import Button from "@mui/material/Button";
import { getAdminUserData } from "../services/tokenService";
import { RotatingLines } from "react-loader-spinner";
=======
>>>>>>> 479735f9c643a25850edc450e734af2756134a32

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
        <title>Sub Admin </title>
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

<<<<<<< HEAD
          <Box sx={{ mt: 3 }} style={{ textAlign: "center", minHeight: `${loading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <RotatingLines
                strokeColor="#5048e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="66"
                visible={true}
              />
            ) : (
              <AdminsList
                data={subadmin}
                handleRefresh={getAdminUsers}
                searchQuery={searchText}
                style={{ width: "100%" }}
              />
            )}
=======
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <AdminsList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAdminUsers}
              searchQuery={searchText}
              onPressUpdate={OpenAddUserModal}
              style={{ width: "100%" }}
            />
>>>>>>> 479735f9c643a25850edc450e734af2756134a32
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />

      <UpdateSubAdminModal
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
