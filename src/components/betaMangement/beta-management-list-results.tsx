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
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
import { getNormalizedError } from "../../utils/helpers";
import { handleUpdateNewsImages } from "../../services/newsService";
import StatusModal from "../StatusModal";
import { changesImageUrl } from "../../services/shopService";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  count?: number;
  handlePageChange?: (p?: any, c?: any) => void;
  handleLimitChange?: (p?: any, c?: any) => void;
  page?: number;
  limit?: number;
  getbetaListing: () => void;
}

export const BetamangementResults = (props: Props) => {
  const {
    data,
    searchQuery,
    count,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    getbetaListing,
  } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [statusData, setStatusData] = useState(null);

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter(
        (user) =>
          user?.discord?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data;
    }
  }, [page, limit, data, searchQuery]);

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>discord</TableCell>
                  <TableCell style={{ color: "#fff" }}>email</TableCell>
                  <TableCell style={{ color: "#fff" }}>walletAddress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => (
                  <TableRow
                    hover
                    key={item?._id}
                    selected={selectedCustomerIds.indexOf(item?._id) !== -1}
                  >
                    <TableCell>{item?.discord}</TableCell>
                    <TableCell>{item?.email}</TableCell>
                    <TableCell>{item?.walletAddress} </TableCell>

                    <TableCell>
                      {moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")}
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

BetamangementResults.propTypes = {
  data: PropTypes.array.isRequired,
};
