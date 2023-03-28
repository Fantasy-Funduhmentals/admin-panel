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
import { DeleteBugsReport } from "../../services/userService";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { getNormalizedError } from "../../utils/helpers";
import NoDataFound from "../NoDataFound/NoDataFound";
import StatusModal from "../StatusModal";
import useBugsHook from "./useBugsHook";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
interface Props extends CardProps {
  searchQuery?: string;
  loadingApi?: boolean;
  data?: any[];
  RefreshAdminUsersData?: () => any;
  onPressUpdate?: any;
}

export const BugsList = (props: Props) => {
  const {
    searchQuery,

    RefreshAdminUsersData,
    onPressUpdate,
    loadingApi,
    data,
  } = props;
  const {
    dataToDisplay,
    selectedCustomerIds,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    statusData,
    setStatusData,
    subadmin,
  } = useBugsHook(searchQuery, RefreshAdminUsersData, data);
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
                        <TableCell style={{ color: "#fff" }}>subject</TableCell>
                        <TableCell style={{ color: "#fff" }}>Message</TableCell>
                        <TableCell style={{ color: "#fff" }}>Action</TableCell>
                        <TableCell style={{ color: "#fff" }}>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToDisplay?.map((item) => (
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

                            <TableCell>{item?.subject}</TableCell>
                            <TableCell>
                              <Box id="ellipsis">{item?.message}</Box>
                            </TableCell>

                            <TableCell>
                              <AlertDialog
                                id={item?._id}
                                handleRefresh={RefreshAdminUsersData}
                              />
                            </TableCell>
                            <TableCell
                              onClick={() => onPressUpdate(item)}
                              sx={{ cursor: "pointer" }}
                            >
                              <FullscreenIcon />
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
            count={data?.length}
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

BugsList.propTypes = {
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
      await DeleteBugsReport(id);
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
