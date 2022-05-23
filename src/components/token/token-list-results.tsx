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
import { useMemo, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { CopyToClipboard } from "react-copy-to-clipboard";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const TokenListResults = (props: Props) => {
  const { data, searchQuery, onPressEdit } = props;
  console.log(data, ">>>>>>>>>>>>>>>>");

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(null);

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
      // return data
      //   .filter(
      //     (user) =>
      //       user.displayName
      //         ?.toLowerCase()
      //         .includes(searchQuery.toLowerCase()) ||
      //       user.displaySymbol
      //         ?.toLowerCase()
      //         .includes(searchQuery.toLowerCase())
      //   )
      //   .slice(begin, end);
    } else {
      return data
        ?.slice(begin, end)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    }
  }, [page, limit, data, searchQuery]);

  function premium(customer) {
    return (customer?.strikePrice - customer?.price).toFixed(2);
  }

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
              <TableHead sx={{ background: "#5a82d7" }}>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === data.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                  <TableCell style={{ color: "white" }}>Name</TableCell>
                  <TableCell style={{ color: "white" }}>ID</TableCell>
                  <TableCell style={{ color: "white" }}>Symbol</TableCell>

                  <TableCell style={{ color: "white" }}>minted</TableCell>
                  <TableCell style={{ color: "white" }}>available</TableCell>
                  <TableCell style={{ color: "white" }}>market(usd)</TableCell>
                  <TableCell style={{ color: "white" }}>Premium(usd)</TableCell>
                  <TableCell style={{ color: "white" }}>strike(usd)</TableCell>
                  <TableCell style={{ color: "white" }}>Order Index</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer, index) => {
                  return (
                    <TableRow
                      hover
                      key={customer._id}
                      selected={
                        selectedCustomerIds.indexOf(customer._id) !== -1
                      }
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Avatar src={customer.icon.url} sx={{ mr: 2 }}>
                            {getInitials(customer.displayName)}
                          </Avatar>
                          <Typography
                            color="textPrimary"
                            variant="body1"
                            sx={{ minWidth: "150px" }}
                          >
                            {customer.displayName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <CopyToClipboard text={customer?._id}>
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() => setActive(index)}
                          >
                            {customer?._id}
                          </button>
                        </CopyToClipboard>
                        <Box>
                          {active == index ? (
                            <span style={{ color: "green" }}>Copied.</span>
                          ) : null}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <img
                          src={customer?.displaySymbol}
                          style={{ height: 30, width: 30 }}
                        />
                      </TableCell>
                      <TableCell>
                        {customer?.totalSupply.toLocaleString()}{" "}
                      </TableCell>
                      <TableCell>
                        {Number(
                          customer?.remainingSupply.toFixed(2)
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>${customer?.price.toLocaleString()}</TableCell>
                      <TableCell>${premium(customer)} </TableCell>
                      <TableCell>
                        $
                        {Number(
                          (customer.price * customer.multiplier).toFixed(3)
                        ).toLocaleString()}{" "}
                      </TableCell>

                      <TableCell>
                        {customer.orderIndex.toLocaleString()}
                      </TableCell>
                      <TableCell onClick={() => onPressEdit(customer)}>
                        <ModeEditIcon color="secondary" />
                      </TableCell>
                    </TableRow>
                  );
                })}
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
