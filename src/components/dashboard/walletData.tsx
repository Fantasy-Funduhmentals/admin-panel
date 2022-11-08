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
  CardHeader,
} from "@mui/material";
import moment from "moment";
import PropTypes, { any } from "prop-types";
import { useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { handleBlock } from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import NoDataFound from "../NoDataFound/NoDataFound";

interface Props extends CardProps {
  data?: any | {};
  searchQuery?: string;
}

const DropdownData = [
  {
    name: "Jan",
    id: 1,
  },
  {
    name: "Feb",
    id: 2,
  },
  {
    name: "Mar",
    id: 3,
  },
  {
    name: "Apr",
    id: 4,
  },
  {
    name: "May",
    id: 5,
  },
  {
    name: "June",
    id: 6,
  },
  {
    name: "July",
    id: 7,
  },
  {
    name: "Aug",
    id: 8,
  },
  {
    name: "Sep",
    id: 9,
  },
  {
    name: "Oct",
    id: 10,
  },
  {
    name: "Nov",
    id: 11,
  },
  {
    name: "Dec",
    id: 12,
  },
];

export const WalletData = (props: Props) => {
  const { data, searchQuery } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [statusData, setStatusData] = useState(null);
  const [selected, setSelected] = useState("");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  let totalrow;
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    let month: any = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const begin = page * limit;
    const end = begin + limit;
    if (selected) {
      month = selected;
    } else {
      setSelected(month + 1);
    }
    totalrow = data[0]?.data?.length;
    const result = data.find((wallet) => wallet?._id?.month == month);
    return result ? result?.data?.reverse().slice(begin, end) : [];
  }, [page, limit, data, totalrow, selected]);

  return (
    <Card {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardHeader title="Wallet Data" />

        <FormControl sx={{ width: "250px" }}>
          <InputLabel id="simple-select-label">Select Month</InputLabel>
          <Select
            labelId="select-label"
            id="simple-select"
            value={selected}
            label="Select History"
            onChange={handleChange}
          >
            {DropdownData.map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
              {dataToDisplay == 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <NoDataFound />{" "}
                </Box>
              ) : (
                <>
                  <TableHead sx={{ background: "#5a82d7" }}>
                    <TableRow>
                      <TableCell style={{ color: "#fff" }}>Token</TableCell>
                      <TableCell style={{ color: "#fff" }}>user name</TableCell>
                      <TableCell style={{ color: "#fff" }}>email</TableCell>
                      <TableCell style={{ color: "#fff" }}>deposit</TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        deposit on
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataToDisplay?.map((customer) => (
                      <TableRow
                        hover
                        key={customer._id}
                        selected={
                          selectedCustomerIds.indexOf(customer.orderIndex) !==
                          -1
                        }
                      >
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <Avatar
                              src={customer.token[0]?.icon.url}
                              sx={{ mr: 2 }}
                            >
                              {getInitials(customer.token[0]?.displayName)}
                            </Avatar>
                            <Typography
                              color="textPrimary"
                              variant="body1"
                              sx={{ minWidth: "150px" }}
                            >
                              {customer.token[0]?.displayName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{customer.user[0].name}</TableCell>
                        <TableCell>{customer.user[0].email}</TableCell>
                        <TableCell>{customer.amount}</TableCell>

                        <TableCell>
                          {moment(customer.createdAt).format(
                            "DD/MM/YYYY hh:mm A"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              )}
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={totalrow}
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

WalletData.propTypes = {
  data: PropTypes.array.isRequired,
};
