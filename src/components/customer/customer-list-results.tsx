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
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

export const UserListResults = (props: Props) => {
  const { data, searchQuery } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [sdira, setSdira] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
  console.log("dataToDisplay", dataToDisplay);

  const handleSdira = () => {
    setSdira(!sdira);
  };

  return (
    <Card {...props}>
      <Box
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ ml: 3 }}>
          <Button sx={{ mb: 4 }} variant="contained" onClick={handleSdira}>
            Search Sdira
          </Button>
        </Box>
      </Box>

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
              <TableHead sx={{ background: "#5a82d7" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>Email</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Wallet Activation Status
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Customer Status
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>User type</TableCell>
                  <TableCell style={{ color: "#fff" }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar src={customer.profilePicture} sx={{ mr: 2 }}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>

                    <TableCell>
                      <SeverityPill
                        color={
                          (customer.isWalletActivated && "success") || "error"
                        }
                      >
                        {customer.isWalletActivated
                          ? "Activated"
                          : "Not Activated"}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      <SeverityPill
                        color={(customer.isCustomer && "success") || "error"}
                      >
                        {customer.isCustomer ? "Verified" : "Not Verified"}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>
                      {moment(customer.createdAt).format("DD/MM/YYYY hh:mm A")}
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
    </Card>
  );
};

UserListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
