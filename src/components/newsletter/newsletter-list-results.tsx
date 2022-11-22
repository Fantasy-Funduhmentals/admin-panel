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
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import moment from "moment";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  count?: number;
  handlePageChange?: (p?: any, c?: any) => void;
  handleLimitChange?: (p?: any, c?: any) => void;
  page?: number;
  limit?: number;
}

export const NewsletterListResults = (props: Props) => {
  const {
    data,
    searchQuery,
    count,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
  } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter((user) =>
        user.detail?.title().includes(searchQuery.toLowerCase())
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
                  <TableCell style={{ color: "#fff" }}>Email</TableCell>
                  <TableCell style={{ color: "#fff" }}>id</TableCell>
                  <TableCell style={{ color: "#fff" }}>created At</TableCell>
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
                        <Avatar src={item?.detail?.Url} sx={{ mr: 2 }}>
                          {getInitials(item?.email)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {item?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item?._id}</TableCell>
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
    </Card>
  );
};

NewsletterListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
