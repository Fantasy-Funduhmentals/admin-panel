import {
  Avatar,
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
  Typography,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import StatusModal from "../StatusModal";
import { deleteShopData, getShopStatus } from "../../services/shopService";
import { getInitials } from "../../utils/get-initials";
import { getNormalizedError } from "../../utils/helpers";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  handleRefresh: () => any;
  handlePageChange?: (e?: any, p?: any) => void;
  handleLimitChange?: (e?: any, p?: any) => void;
  page?: number;
  limit?: number;
  count?: number;
  onPressUpdate?: any;
}

export const CloseBetaListResult = (props: Props) => {
  const {
    data,
    searchQuery,
    handleRefresh,
    handlePageChange,
    handleLimitChange,
    onPressUpdate,
    page,
    limit,
    count,
  } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [rejectShow, setrejectShow] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter((item) =>
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchQuery]);

  const handleSubmit = async (data: any) => {
    let params = { isActive: !data.isActive };
    try {
      setloading(true);
      const response = await getShopStatus(data._id, params);
      handleRefresh();
      setStatusData({
        type: "success",
        message: response?.data?.message,
      });
      setloading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setloading(false);
    }
  };

  const handleClose = () => {
    setrejectShow(false);
  };

  const handleOpenModal = (data) => {
    setrejectShow(true);
    setDeleteId(data._id);
  };

  const handleDelete = async () => {
    try {
      setDelLoading(true);
      const response = await deleteShopData(deleteId);
      handleRefresh();
      setStatusData({
        type: "success",
        message: response?.data?.message,
      });
      setDelLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setDelLoading(false);
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
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Email</TableCell>
                  <TableCell style={{ color: "#fff" }}>discord</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Wallet address
                  </TableCell>
                  {/* <TableCell style={{ color: "#fff" }}>created At</TableCell>
                  <TableCell style={{ color: "#fff" }}>active</TableCell>
                  <TableCell style={{ color: "#fff" }}></TableCell>
                  <TableCell style={{ color: "#fff" }}>Edit</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => (
                  <TableRow
                    hover
                    key={item?._id}
                    selected={selectedCustomerIds.indexOf(item?._id) !== -1}
                  >
                    {/* <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar src={item?.mediaURL} sx={{ mr: 2 }}>
                          {getInitials(item?.coinSymbol)}
                        </Avatar>
                        <Typography>{item?.coinSymbol}</Typography>
                      </Box>
                    </TableCell> */}
                    <TableCell>{item?.email}</TableCell>

                    <TableCell>
                      <Typography>{item?.discord}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{item?.walletAddress}</Typography>
                    </TableCell>
                    {/* <TableCell>
                      {moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell> */}
                    {/* <TableCell onClick={() => handleSubmit(item)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: `${
                            item?.isActive
                              ? "1px solid #14B8A6"
                              : "1px solid rgb(209, 67, 67)"
                          }`,
                          color: `${
                            item?.isActive ? "#14B8A6" : "rgb(209, 67, 67)"
                          }`,
                        }}
                      >
                        {item?.isActive ? "true" : "false"}
                      </Button>
                    </TableCell> */}
                    {/* <TableCell onClick={() => handleOpenModal(item)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: "1px solid rgb(209, 67, 67)",
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell> */}

                    {/* <TableCell onClick={() => onPressUpdate(item)}>
                      <ModeEditIcon color="success" />
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={count}
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
            rowGap: "2rem",
            boxShadow: 60,
            padding: "1.5rem",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete?
          </Typography>

          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              columnGap: "1rem",
              rowGap: "1rem",
            }}
          >
            <Button
              style={{ width: "100%" }}
              color="success"
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              style={{ width: "100%" }}
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
              onClick={!delLoading && handleDelete}
            >
              {delLoading ? "loading..." : "Delete"}
            </Button>
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

CloseBetaListResult.propTypes = {
  data: PropTypes.array.isRequired,
};
