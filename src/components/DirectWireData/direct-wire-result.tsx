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
import { DIRECT_WIRE } from "../../utils/enums/request.enum";
import { NestCamWiredStandTwoTone } from "@mui/icons-material";

interface Props extends CardProps {
  data: any | {};
  status: any;
  page: number;
  total: number;
  setPage: any
  onPressEdit?: any;
}

export const NftListResults = (props: Props) => {
  let { data, onPressEdit, page, setPage } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const dataToDisplay = useMemo(() => {
    return data?.data;
  }, [data?.data]);

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",

            overflowX: "auto",
          }}
        >
          <Box>
            {dataToDisplay?.length == 0 ? (
              <NoDataFound />
            ) : (
              <Table>
                <TableHead sx={{ background: "#5a82d7" }}>
                  <TableRow>
                    <TableCell style={{ color: "#fff" }}>Order Id</TableCell>
                    <TableCell style={{ color: "#fff" }}>User</TableCell>
                    <TableCell style={{ color: "#fff" }}>User type</TableCell>
                    <TableCell style={{ color: "#fff" }}>
                      Request Status
                    </TableCell>

                    <TableCell style={{ color: "#fff" }}>Amount</TableCell>
                    <TableCell style={{ color: "#fff" }}>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataToDisplay?.map((customer) => {
                    let typeText = "";
                    switch (customer.type) {
                      case DIRECT_WIRE.NFT_PURCHASE:
                        typeText = "Opportunity Token Acquire";
                        break;
                      case DIRECT_WIRE.TOKEN_PURCHASE:
                        typeText = "Token Acquire";
                        break;
                      case DIRECT_WIRE.WALLET_ACTIVATION:
                        typeText = "Wallet Activation";
                        break;
                      case DIRECT_WIRE.SUBSCRIPTION:
                        typeText = "SUbscription";
                        break;
                      default:
                        console.log();
                    }

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
                              src={customer?.user?.profilePicture}
                              sx={{ mr: 2 }}
                            >
                              {getInitials(customer?.user?.name)}
                            </Avatar>
                            <Box
                              sx={{
                                alignItems: "center",
                              }}
                            >
                              <Typography color="textPrimary" variant="body1">
                                {customer?.user?.name}
                              </Typography>
                              {customer?.user?.email}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>{customer?.user?.type}</TableCell>
                        <TableCell>{customer?.status}</TableCell>

                        <TableCell>
                          ${Number(customer.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {/* {capitalizeFirstLetter(customer.type)} */}
                          {typeText}
                          {/* Token Acquire  */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data?.total}
        onPageChange={handlePageChange}
        page={page - 1}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
};
