import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import AddUserModal from "../components/add-user-modal";
import { UserListResults } from "../components/customer/customer-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { getAllUsers } from "../services/userService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveUsers } from "../store/reducers/userSlice";
import { getNormalizedError } from "../utils/helpers";

const Users = () => {
  const { users } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState<number>(0);

  const getUserListing = async () => {
    try {
      setLoading(true);
      const usersRes = await getAllUsers(page);
      dispatch(saveUsers(usersRes.data));
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
    getUserListing();
  }, [reload, page]);

  console.log(users, "users")
  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ListToolbar
            title="User Management"
            subTitle="User"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            onPressAdd={() => {
              setUserModalOpen(true);
            }}
            handleRefresh={getUserListing}
          />
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            sx={{
              mt: 3,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <UserListResults
                data={users}
                searchQuery={searchText}
                handleRefresh={getUserListing}
                style={{ width: "100%" }}
                setPage={setPage}
                page={page} total={0} status={undefined} />
            )}
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
      <AddUserModal
        open={userModelOpen}
        onClose={() => {
          setUserModalOpen(false);
          setReload(!reload);
        }}
      />
    </>
  );
};
Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
