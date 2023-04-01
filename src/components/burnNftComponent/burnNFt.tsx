import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
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
import useSubadmin from "./useBurnNFT";

interface Props extends CardProps {
  searchQuery?: string;
  loadingApi?: boolean;
  RefreshAdminUsersData?: () => any;
}

export const NftBurnList = (props: Props) => {
  const { searchQuery, RefreshAdminUsersData, loadingApi } = props;

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
  } = useSubadmin(searchQuery, RefreshAdminUsersData);

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
                        <TableCell style={{ color: "#fff" }}>Address</TableCell>
                        <TableCell style={{ color: "#fff" }}>value</TableCell>
                        <TableCell style={{ color: "#fff" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToDisplay?.map((item, index) => (
                        <>
                          <TableRow
                            hover
                            key={item._id}
                            selected={
                              selectedCustomerIds.indexOf(item._id) !== -1
                            }
                          >
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>{item?.email}</TableCell>

                            <TableCell>{item?.role}</TableCell>
                            <TableCell>{index + 1}</TableCell>

                            <TableCell>
                              <AlertDialog
                                id={item?._id}
                                handleRefresh={RefreshAdminUsersData}
                              />
                            </TableCell>
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

          <StatusModal
            statusData={statusData}
            onClose={() => setStatusData(null)}
          />
        </Card>
      )}
    </>
  );
};

NftBurnList.propTypes = {
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
