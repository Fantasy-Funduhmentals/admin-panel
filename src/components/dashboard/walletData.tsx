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
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { handleBlock } from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";

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
  const [array, setarray] = useState([]);
  // data.map(hello => {
  //   let date = new Date().getMonth() + 1
  //   if(date == hello){

  //   }
  // })
  useEffect(() => {
    let arr = [];

    console.log(data, "filterDatappppppppppppppppppp");
    const filterMonth = DropdownData.find(
      (item) => item.id == new Date().getMonth() + 1
    );

    const filterData = data.find((hello) =>
      hello._id.month == selected ? selected : filterMonth.id
    );
    console.log(filterData, "selectedppppppppppp");

    filterData.data.map((el) => {
      el.token.map((item) => {
        item.user;
        arr.push({
          cloneToken: item,
          amount: el.amount,
          createdAt: el.createdAt,
          email: el.user[0].email,
          username: el.user[0].name,
        });
        // console.log("item", item);
      });
    });
    setarray(arr);
  }, [selected]);
  // let month = new Date().getMonth() + 1;

  const handleChange = (event) => {
    console.log(event.target.value, "e");
    setSelected(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const filterMonth = DropdownData.find(
      (item) => item.id == new Date().getMonth() + 1
    );
    setSelected(filterMonth.id);
    // data.map(item => {
    //   if(item._id === )
    // })
  }, []);

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;
    const date = new Date().getMonth() + 1;
    console.log("current monthhhh", date);

    return array?.slice(begin, end);
  }, [page, limit, array]);
  console.log(dataToDisplay, "array");

  return (
    <Card {...props}>
      <FormControl sx={{ width: "150px" }}>
        <InputLabel id="simple-select-label">Select Year</InputLabel>
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
                  <TableCell style={{ color: "#fff" }}>Token</TableCell>
                  <TableCell style={{ color: "#fff" }}>user name</TableCell>
                  <TableCell style={{ color: "#fff" }}>email</TableCell>
                  <TableCell style={{ color: "#fff" }}>balance</TableCell>
                  <TableCell style={{ color: "#fff" }}>created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={
                      selectedCustomerIds.indexOf(customer.orderIndex) !== -1
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
                          src={customer.cloneToken.icon.url}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer.cloneToken.displayName)}
                        </Avatar>
                        <Typography
                          color="textPrimary"
                          variant="body1"
                          sx={{ minWidth: "150px" }}
                        >
                          {customer.cloneToken.displayName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.username}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.amount}</TableCell>

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
