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
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import NoDataFound from "../NoDataFound/NoDataFound";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const NftListResults = (props: Props) => {
  const { data, searchQuery, onPressEdit } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;
    let filterData = data?.slice().sort((v1, v2) => v1.index - v2.index);

    if (searchQuery.length > 0) {
      return filterData
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.displaySymbol
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return filterData?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

  // function numberWithCommas(n) {
  //   var parts = n ? n.toString().split(".") : "";
  //   return (
  //     parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
  //     (parts[1] ? "." + parts[1] : "")
  //   );
  // }
  function capitalizeFirstLetter(str:string) {
    return str[0].toUpperCase() + str.slice(1);
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
         {dataToDisplay.length == 0 ?  <NoDataFound/> :
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
                  <TableCell style={{ color: "#fff" }}>Order Id</TableCell>
                  <TableCell style={{ color: "#fff" }}>User</TableCell>
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>Email</TableCell>

                  <TableCell style={{ color: "#fff" }}>Amount</TableCell>
                  <TableCell style={{ color: "#fff" }}>Type</TableCell>
                  {/* <TableCell></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => {
                  return (
                    <TableRow
                      sx={{ cursor: "pointer" }}
                      onClick={() => onPressEdit(customer)}
                      hover
                      key={customer._id}
                      selected={
                        selectedCustomerIds.indexOf(customer._id) !== -1
                      }
                    >
                      <TableCell>{customer?.orderId}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Avatar
                            src={customer?.remittanceAddress?.signatureUrl}
                            sx={{ mr: 2 }}
                          >
                            {getInitials(customer?.remittanceAddress?.name)}
                          </Avatar>
                          <Box
                            sx={{
                              alignItems: "center",
                            }}
                          >
                            <Typography color="textPrimary" variant="body1">
                              {customer?.remittanceAddress?.name}
                            </Typography>
                            {customer?.remittanceAddress?.email}
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>{customer?.remittanceAddress?.name}</TableCell>
                      <TableCell>
                        {customer?.remittanceAddress?.email}
                      </TableCell>

                      <TableCell>{customer.amount}</TableCell>
                      <TableCell>{capitalizeFirstLetter(customer.type)}</TableCell>
                   
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>}
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
