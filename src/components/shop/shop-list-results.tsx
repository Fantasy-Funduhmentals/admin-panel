import {
  Avatar,
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
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
import StatusModal from "../../components/StatusModal";
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

export const ShopListResults = (props: Props) => {
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

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter((item) =>
        item.coinSymbol?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchQuery]);

  const handleSubmit = async (data) => {
    try {
      setloading(true);
      const response = await getShopStatus(data._id);
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

  const handleDelete = async (data) => {
    try {
      setDelLoading(true);
      const response = await deleteShopData(data._id);
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
                  <TableCell style={{ color: "#fff" }}>coin Symbol</TableCell>
                  <TableCell style={{ color: "#fff" }}>title</TableCell>
                  <TableCell style={{ color: "#fff" }}>price</TableCell>
                  <TableCell style={{ color: "#fff" }}>created At</TableCell>
                  <TableCell style={{ color: "#fff" }}>active</TableCell>
                  <TableCell style={{ color: "#fff" }}></TableCell>
                  <TableCell style={{ color: "#fff" }}>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => (
                  <TableRow
                    hover
                    key={item?._id}
                    selected={selectedCustomerIds.indexOf(item?._id) !== -1}
                  >
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{item?.title}</TableCell>

                    <TableCell>
                      <Typography>{item?.price}</Typography>
                    </TableCell>
                    <TableCell>
                      {moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell onClick={() => handleSubmit(item)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: `${
                            item?.active
                              ? "1px solid #14B8A6"
                              : "1px solid rgb(209, 67, 67)"
                          }`,
                          color: `${
                            item?.active ? "#14B8A6" : "rgb(209, 67, 67)"
                          }`,
                        }}
                      >
                        {item?.active ? "true" : "false"}
                      </Button>
                    </TableCell>
                    <TableCell onClick={() => handleDelete(item)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: "1px solid rgb(209, 67, 67)",
                        }}
                      >
                        Delete Shop
                      </Button>
                    </TableCell>

                    <TableCell onClick={() => onPressUpdate(item)}>
                      <ModeEditIcon color="success" />
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
        count={count}
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
  );
};

ShopListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
