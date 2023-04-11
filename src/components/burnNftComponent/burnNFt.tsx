import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { nftBurnRequest } from "../../services/nftService";
import { getNormalizedError } from "../../utils/helpers";
import NoDataFound from "../NoDataFound/NoDataFound";
import StatusModal from "../StatusModal";
import useSubadmin from "./useBurnNFT";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ListAltIcon from "@mui/icons-material/ListAlt";

interface Props extends CardProps {
  searchQuery?: string;
  loadingApi?: boolean;
  RefreshAdminUsersData?: () => any;
  page: number;
  limit: number;
  data: any;
  handlePageChange?: (p?: any, c?: any) => void;
  handleLimitChange?: (p?: any, c?: any) => void;
  count?: number;
}

export const NftBurnList = (props: Props) => {
  const {
    searchQuery,
    RefreshAdminUsersData,
    loadingApi,
    page,
    limit,
    data,
    handlePageChange,
    handleLimitChange,
    count,
  } = props;
  console.log("🚀 ~ file: burnNFt.tsx:55 ~ NftBurnList ~ data:", data);

  const { dataToDisplay, selectedCustomerIds, statusData, setStatusData } =
    useSubadmin(searchQuery, RefreshAdminUsersData, page, limit, data);

  const copyText = (item) => {
    if (item != undefined) {
      navigator?.clipboard?.writeText(item);
      setStatusData({
        type: "success",
        message: "Address copyed successfully",
      });
    }
  };

  return (
    <>
      {loadingApi ? (
        <CircularProgress />
      ) : (
        <Card {...props}>
          <PerfectScrollbar>
            <Paper
              style={{
                width: "100%",
                // marginTop: theme.spacing.unit * 3,
                overflowX: "auto",
              }}
            >
              {dataToDisplay?.length === 0 ? (
                <NoDataFound />
              ) : (
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: "black" }}>
                        <TableCell style={{ color: "#fff" }}>Name</TableCell>
                        <TableCell style={{ color: "#fff" }}>Email</TableCell>
                        <TableCell style={{ color: "#fff" }}>nft id</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Wallet Address
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          listing Price
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>value</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          quantity
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Total payable amount
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>status</TableCell>
                        <TableCell style={{ color: "#fff" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToDisplay?.map((item, index) => (
                        <>
                          <TableRow
                            hover
                            key={item._id}
                            selected={
                              selectedCustomerIds.indexOf(item._id) !== -1
                            }
                          >
                            <TableCell>{item?.user?.name}</TableCell>
                            <TableCell>{item?.user?.email}</TableCell>
                            <TableCell>{item?.nft?.id}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  columnGap: "0.5rem",
                                }}
                              >
                                <Box>
                                  {item?.walletAddress.substring(0, 10)}
                                  .....
                                  {item?.walletAddress.substring(
                                    item?.walletAddress.length - 6
                                  )}
                                </Box>
                                <ContentCopyIcon
                                  onClick={() => copyText(item?.walletAddress)}
                                  sx={{ cursor: "pointer", height: "17px" }}
                                />
                              </Box>
                            </TableCell>

                            <TableCell>
                              {item?.listingPrice ? item?.listingPrice : "-"}
                            </TableCell>
                            <TableCell>
                              {item?.nft?.value
                                ? Number(item?.nft?.value)?.toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {item?.quantity
                                ? Number(item?.quantity)?.toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {Number(item?.listingPrice > 0)
                                ? Number(
                                    item?.listingPrice * item?.quantity
                                  )?.toLocaleString()
                                : Number(
                                    item?.nft?.value * item?.quantity
                                  )?.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {item?.status ? item?.status : "-"}
                            </TableCell>

                            <TableCell>
                              {item?.status != "approved" && (
                                <AlertDialog
                                  id={item?._id}
                                  handleRefresh={RefreshAdminUsersData}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={count}
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
      )}
    </>
  );
};

NftBurnList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default function AlertDialog({ id, handleRefresh }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleStatue = async (type) => {
    setLoading(true);
    try {
      let param = {
        status: type,
      };
      const res = await nftBurnRequest(id, param);
      setStatusData({
        type: "success",
        message: res?.data?.message,
      });
      setLoading(false);
      handleRefresh();
      handleClose();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <ListAltIcon style={{ cursor: "pointer" }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to approve this request
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleStatue("rejected")}>Reject</Button>
          {loading ? (
            <Button>Loading...</Button>
          ) : (
            <Button onClick={() => handleStatue("approved")} autoFocus>
              Approve
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </div>
  );
}
