import {
  Avatar,
  Box,
  Card,
  CardProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const TokenListResults = (props: Props) => {
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

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.displayName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user.displaySymbol
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return data.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
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
                <TableCell>Name</TableCell>
                <TableCell>Symbol</TableCell>

                <TableCell>Price</TableCell>
                <TableCell>Order Index</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataToDisplay.map((customer) => {
                return (
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
                        <Avatar src={customer.icon.url} sx={{ mr: 2 }}>
                          {getInitials(customer.displayName)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.displayName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <img
                        src={customer?.displaySymbol}
                        style={{ height: 30, width: 30 }}
                      />
                    </TableCell>
                    <TableCell>${customer.price} </TableCell>
                    <TableCell>{customer.orderIndex}</TableCell>
                    <TableCell onClick={() => onPressEdit(customer)}>
                      <ModeEditIcon color="secondary" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};
