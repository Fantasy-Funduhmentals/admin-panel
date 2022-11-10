import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
  FormControl,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { getNormalizedError } from "../../utils/helpers";
import NoDataFound from "../NoDataFound/NoDataFound";
import StatusModal from "../StatusModal";
import usePlayerData from "./usePlayerData";
interface Props extends CardProps {
  searchQuery?: string;
  loadingApi?: boolean;

  RefreshAdminUsersData?: () => any;
  onPressUpdate?: any;
}

export const PlayerList = (props: Props) => {
  const {
    searchQuery,

    RefreshAdminUsersData,
    onPressUpdate,
    loadingApi,
  } = props;
  const {
    dataToDisplay,
    selectedCustomerIds,
    handleBlockUser,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    handleSubmit,
    statusData,
    setStatusData,
    subadmin,
  } = usePlayerData(searchQuery, RefreshAdminUsersData);
  return (
    <>
      {loadingApi ? (
        <CircularProgress />
      ) : (
        <Card {...props}>
          <PerfectScrollbar>
            <Paper
              style={{
                width: "100%",
                // marginTop: theme.spacing.unit * 3,
                overflowX: "auto",
              }}
            >
              {dataToDisplay?.length === 0 ? (
                <NoDataFound />
              ) : (
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: "black" }}>
                        <TableCell style={{ color: "#fff" }}>Name</TableCell>
                        <TableCell style={{ color: "#fff" }}>Email</TableCell>
                        <TableCell style={{ color: "#fff" }}>roles</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Permissions
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Block/Unblock
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>Action</TableCell>
                        {/* <TableCell style={{ color: "#fff" }}>Edit</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToDisplay?.map((customer) => (
                        <>
                          <TableRow
                            hover
                            key={customer._id}
                            selected={
                              selectedCustomerIds.indexOf(customer._id) !== -1
                            }
                          >
                            <TableCell>{customer?.name}</TableCell>
                            <TableCell>{customer?.email}</TableCell>

                            <TableCell>{customer?.role}</TableCell>

                            {/* <TableCell>
                              <Button onClick={handleClickOpen}>
                                See Permissions
                              </Button>
                              <Dialog
                                disableEscapeKeyDown
                                open={openPer}
                                onClose={handleClosePermissions}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    maxHeight: "250px",
                                    padding: "10px 10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    overflow: "auto",
                                    border: "1px solid #cbcbcb",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {customer?.adminPermissions?.map(
                                    (item, index) => (
                                      <>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            width: "100%",
                                          }}
                                        >
                                          <ListItem
                                            sx={{
                                              fontWeight: "bold",
                                              cursor: "default",
                                              width: "100%",
                                              color: "rebeccapurple",
                                              borderBottom: "1px solid #cbcbcb",
                                            }}
                                            key={index}
                                          >
                                            {item?.name}
                                          </ListItem>
                                        </Box>
                                      </>
                                    )
                                  )}
                                </Box>
                              </Dialog>
                            </TableCell> */}
                            <TableCell>
                              <FormControl fullWidth>
                                {/* <InputLabel id="demo-simple-select-label">
                                  See Permissions
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="See Permissions"
                                >
                                  {customer?.adminPermissions?.map(
                                    (item, index) => (
                                      <MenuItem key={index}>
                                        {item.name}
                                      </MenuItem>
                                    )
                                  )}
                                </Select> */}
                                {/* {customer?.adminPermissions.join(", ")} */}

                                {customer?.adminPermissions?.map(
                                  (name, i, v) =>
                                    ` ${name}${
                                      (i > 0 || i + 1 <= v.length) &&
                                      i + 1 < v.length
                                        ? ","
                                        : ""
                                    }`
                                )}
                              </FormControl>
                            </TableCell>

                            <TableCell
                              onClick={() => handleBlockUser(customer)}
                            >
                              <Button
                                sx={{
                                  cursor: "pointer",
                                  border: `${
                                    customer.isBlocked
                                      ? "1px solid green"
                                      : "1px solid rgb(209, 67, 67)"
                                  }`,
                                  color: `${
                                    customer.isBlocked
                                      ? "green"
                                      : "rgb(209, 67, 67)"
                                  }`,
                                  width: `${
                                    customer.isBlocked ? "auto" : "50%"
                                  }`,
                                }}
                              >
                                {customer.isBlocked ? "UnBlock" : "Block"}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <AlertDialog
                                id={customer?._id}
                                handleRefresh={RefreshAdminUsersData}
                              />
                            </TableCell>
                            {/* <TableCell onClick={() => onPressUpdate(customer)}>
                              <ModeEditIcon color="secondary" />
                            </TableCell> */}
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={subadmin?.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
          <Modal
            open={rejectShow}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 364,
                bgcolor: "background.paper",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                boxShadow: 60,
                p: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Please Describe Block reason
              </Typography>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                // placeholder="Minimum 3 rows"
                style={{
                  width: 300,
                  resize: "none",
                  height: "200px",
                  border: "1px solid black",
                }}
                onChange={(e) => handleTextAreaChange(e)}
              />
              <Box sx={{ width: "90%", textAlign: "center" }}>
                {loading ? (
                  <Box>
                    <CircularProgress color="inherit" />
                  </Box>
                ) : (
                  <Button
                    style={{ width: 300 }}
                    color="primary"
                    variant="contained"
                    type="submit"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Box>
          </Modal>
          <StatusModal
            statusData={statusData}
            onClose={() => setStatusData(null)}
          />
        </Card>
      )}
    </>
  );
};

PlayerList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default function AlertDialog({ id, handleRefresh }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteAd = async () => {
    setLoading(true);
    try {
      await HTTP_CLIENT.delete(`/admin-auth/delete-subAdmin/${id}`);
      setLoading(false);
      handleRefresh();
      handleClose();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <DeleteIcon style={{ cursor: "pointer" }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to Delete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {loading ? (
            <Button>Loading...</Button>
          ) : (
            <Button onClick={deleteAd} autoFocus>
              Ok
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </div>
  );
}
