import { Box, Container } from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import { useState } from "react";
import AddSubAdminModal from "../components/add-subadmin-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { AdminsList } from "../components/sub-admin/sub-admin";
import UpdateSubAdminModal from "../components/sub-admin/updateSubAdmin/update-subadmin-modal";

const SubAdmin = () => {
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [updateuserModelOpen, setUpdateUserModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editToken, setEditToken] = useState(null);

  const OpenAddUserModal = (userData: any) => {
    setUserModalOpen(!userModelOpen);
  };
  const OpenUpdateUserModal = (userData: any) => {
    setUpdateUserModalOpen(!updateuserModelOpen);
    setEditToken(userData);
  };
  const getAdminUsersData = async () => {
    await setRefreshData(!refreshData);
  };

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
              handleRefresh={getAdminUsersData}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <AdminsList
              refresh={refreshData}
              RefreshAdminUsersData={getAdminUsersData}
              searchQuery={searchText}
              onPressEdit={OpenAddUserModal}
              onPressUpdate={OpenUpdateUserModal}
              style={{ width: "100%" }}
            />
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
      <UpdateSubAdminModal
        open={updateuserModelOpen}
        onClose={() => {
          setUpdateUserModalOpen(false);
          setEditToken(null);
          setReload(!reload);
        }}
        editData={editToken}
      />
    </>
  );
};
SubAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubAdmin;
