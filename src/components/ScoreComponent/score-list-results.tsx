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

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  handleLimitChange?: (prop?: any) => void;
  handlePageChange?: (event: any, prop?: any) => void;
  limit?: number;
  page?: number;
  count?: number;
}

export const ScoreListResults = (props: Props) => {
  const {
    data,
    searchQuery,
    limit,
    page,
    handleLimitChange,
    handlePageChange,
    count,
  } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data.filter((user) =>
        user?.detail?.StadiumDetails?.Name?.toLowerCase().includes(
          searchQuery.toLowerCase()
        )
      );
    } else {
      return data;
    }
  }, [page, limit, data, searchQuery]);

  // function numberWithCommas(n) {
  //   var parts = n ? n.toString().split(".") : "";
  //   return (
  //     parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
  //     (parts[1] ? "." + parts[1] : "")
  //   );}

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
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>City</TableCell>
                  <TableCell style={{ color: "#fff" }}>Country</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Playing Surface
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>State</TableCell>
                  <TableCell style={{ color: "#fff" }}>Score ID</TableCell>
                  <TableCell style={{ color: "#fff" }}>Home Team</TableCell>
                  <TableCell style={{ color: "#fff" }}>Season</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer?._id}
                    selected={selectedCustomerIds.indexOf(customer?._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar
                          src={customer?.detail?.icon?.url}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer?.detail?.StadiumDetails?.Name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer?.detail?.StadiumDetails?.Name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.City}
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.Country}
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.PlayingSurface}
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.State}
                    </TableCell>
                    <TableCell>{customer?.detail?.ScoreID}</TableCell>
                    <TableCell>{customer?.detail?.HomeTeam}</TableCell>
                    <TableCell>{customer?.detail?.Season}</TableCell>
                    <TableCell>{customer?.detail?.Status}</TableCell>
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

ScoreListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
