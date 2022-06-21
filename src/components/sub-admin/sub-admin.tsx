import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  Modal,
  TextareaAutosize,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { useAppDispatch } from "../../store/hooks";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { saveAdminUser } from "../../store/reducers/adminSlice";
import { getAdminUserData } from "../../services/tokenService";
import { handleBlockSubAdmin } from "../../services/userService";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  handleRefresh?: () => any;
}

export const AdminsList = (props: Props) => {
  const { data, searchQuery, handleRefresh } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [sdira, setSdira] = useState(false);
  const [rejectShow, setrejectShow] = useState(false);
  const [signleUser, setsignleUser] = useState(null);
  const [reason, setReason] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleTextAreaChange = (e) => {
    setReason(e.target.value);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else if (sdira) {
      return data.filter((user) => user.sdira);
    } else {
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery, sdira]);

  const handleBlockUser = (data) => {
    console.log(data, "dataaa");
    if (data.isBlocked) {
      setsignleUser(data);
      handleSubmit(data);
    } else {
      setsignleUser(data);
      setrejectShow(true);
    }
  };

  const handleClose = () => {
    setrejectShow(false);
  };
  const handleSubmit = async (data) => {
    let params;
    if (data?.isBlocked) {
      params = {
        userId: data?._id,
        isblocked: !data?.isBlocked,
      };
    } else {
      if (!reason) {
        setStatusData({
          type: "error",
          message: "please enter reason first",
        });
        return;
      }
      params = {
        userId: signleUser?._id,
        isblocked: !signleUser?.isBlocked,
        reasonToBlock: reason,
      };
    }

    try {
      setloading(true);
      const response = await handleBlockSubAdmin(params);
      setStatusData({
        type: "success",
        message: response.data.message,
      });
      handleRefresh();
      setloading(false);
      handleClose();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setloading(false);
    }
  };
  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            // marginTop: theme.spacing.unit * 3,
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>roles</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Block/Unblock</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                  >
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>

                    <TableCell>{customer.role}</TableCell>
                    <TableCell>
                      {customer?.adminPermissions?.length > 0 &&
                        customer.adminPermissions}
                    </TableCell>

                    <TableCell onClick={() => handleBlockUser(customer)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: `${
                            customer.isBlocked
                              ? "1px solid green"
                              : "1px solid rgb(209, 67, 67)"
                          }`,
                          color: `${
                            customer.isBlocked ? "green" : "rgb(209, 67, 67)"
                          }`,
                          width: `${customer.isBlocked ? "auto" : "100%"}`,
                        }}
                      >
                        {customer.isBlocked ? "UnBlock" : "Block"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <AlertDialog id={customer?._id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
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
  );
};

AdminsList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default function AlertDialog({ id }) {
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
