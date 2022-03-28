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
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const SubscriptionListListResults = (props: Props) => {
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
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

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
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>

                  <TableCell>Payment method</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Price in USD</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => {
                  return (
                    <TableRow
                      hover
                      key={item._id}
                      selected={selectedCustomerIds.indexOf(item?._id) !== -1}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Avatar src={item?.logo} sx={{ mr: 2 }}>
                            {/* {getInitials(item.displayName)} */}
                          </Avatar>
                          {/* <Typography color="textPrimary" variant="body1">
                            {item.displayName}
                          </Typography> */}
                        </Box>
                      </TableCell>

                      <TableCell>{item.title} </TableCell>
                      <TableCell>{item.paymentMethod}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>{item.priceUSD}</TableCell>
                      <TableCell onClick={() => onPressEdit(item)}>
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
