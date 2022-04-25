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

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const NftListResults = (props: Props) => {
  const { data, searchQuery, onPressEdit } = props;
  console.log("data&&&", data);

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

  const handleExport = async () => {
    try {
      const response = await HTTP_CLIENT.get(
        "/nft-token/export-all-native-wallets",
        {
          responseType: "blob",
        }
      );

      console.log("response>>", response);
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      const fileName = "NFTs.xlsx";
      fileLink.setAttribute("download", fileName);
      fileLink.setAttribute("target", "_blank");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (error) {}
  };

  return (
    <Card {...props}>
      <Box style={{ width: "100%", marginTop: "2rem", marginLeft: "28rem" }}>
        <Button sx={{ mb: 4 }} variant="contained" onClick={handleExport}>
          Export NFTs
        </Button>
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
                  <TableCell>Owned by</TableCell>
                  <TableCell>Image</TableCell>

                  <TableCell>Index</TableCell>
                  <TableCell>Price Per unit</TableCell>
                  <TableCell>Remaining Supply</TableCell>
                  <TableCell>Total Supply</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => {
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
                          {/* <Avatar src={customer.image} sx={{ mr: 2 }}>
                            {getInitials(customer.name)}
                          </Avatar> */}
                          <Typography color="textPrimary" variant="body1">
                            {customer.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <img
                          src={customer?.image}
                          style={{ height: 30, width: 30 }}
                        />
                      </TableCell>
                      <TableCell>{customer.index} </TableCell>
                      <TableCell>{customer.pricePerShare}</TableCell>
                      <TableCell>{customer.remainingSupply}</TableCell>
                      <TableCell>{customer.totalSupply}</TableCell>
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
