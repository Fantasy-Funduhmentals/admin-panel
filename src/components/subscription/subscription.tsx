import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  CircularProgress,
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
import ModeEditIcon, from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getNormalizedError } from "../../utils/helpers";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { getSubscriptionData } from "../../services/tokenService";
import { saveSubscriptionData } from "../../store/reducers/subscriptionSlice";
import {deleteSubscription} from "../../services/tokenService.ts"


interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
  onRefresh?: any;
}

export const SubscriptionListListResults = (props: Props) => {
  const { data, searchQuery, onPressEdit,onRefresh } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (item) => {
    setLoading(true);
    try {
      const response = await deleteSubscription(item)

        setStatusData({
          type: "success",
          message: response.data.message,
        });
      
        onRefresh()
      
      setLoading(false);
    } catch (err) {
      
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  }

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.paymentMethod
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
      {loading ?<CircularProgress/>  : <PerfectScrollbar>
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
                <TableRow sx={{background:"#5a82d7"}}>
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
                  <TableCell style={{color:"#fff"}}>Image</TableCell>
                  <TableCell style={{color:"#fff"}}>Title</TableCell>
                  {/* <TableCell>Payment method</TableCell> */}
                  <TableCell style={{color:"#fff"}}>Duration</TableCell>
                  <TableCell style={{color:"#fff"}}>Value in USD</TableCell>
                  <TableCell style={{color:"#fff"}}>Order Index</TableCell>
                  <TableCell></TableCell>
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
                      {/* <TableCell>{item.paymentMethod}</TableCell> */}
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>{item.priceUSD}</TableCell>
                      <TableCell>{item.orderIndex}</TableCell>
                      <TableCell onClick={() => onPressEdit(item)}>
                        <ModeEditIcon  color="secondary" />
                    
                      </TableCell>
                      <TableCell>   <DeleteOutlineIcon onClick={() => handleDelete(item)} /></TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>}
     
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
