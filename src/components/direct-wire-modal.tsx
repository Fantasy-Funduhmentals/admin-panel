import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CircularProgress,
  Container,
  Grid,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableBody,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { getInitials } from "../utils/get-initials";
import StatusModal from "./StatusModal";
import { directWiresPost } from "../services/tokenService";
import { getNormalizedError } from "../utils/helpers";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});




interface Props {
  open: boolean;
  onClose: any;
  editData?: any;
}

const FullScreenNFTDialog = (props: Props) => {
  const { open, onClose, editData } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handlePost = async (editData) =>{
    try {
      const data={
        wireId:"1",
        editData,
      }
      setLoading(true)
     await directWiresPost(data);
     setLoading(false)
    } catch (err) {
      setLoading(false)
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      
    }
  
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Direct Wire Details
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={3}
              sx={{ display: "flex", justifyContent: "center", pt: 3 }}
              style={{
                boxShadow: "#0000004a 1px 1px 18px",
                borderRadius: "10px",
              }}
            >
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Grid item lg={4} md={4} xs={12}>
                  <Card>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        pt: 3,
                        pb: 3,
                      }}
                    >
                      <Avatar
                        src={editData?.remittanceAddress?.signatureUrl}
                        sx={{ mr: 2, width: "120px", height: "120px" }}
                      >
                        {getInitials(editData?.remittanceAddress?.name)}
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography color="textPrimary" variant="h3">
                          {editData?.remittanceAddress?.name}
                        </Typography>
                        <Typography color="textSecondary" variant="h6">
                          {editData?.remittanceAddress?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid
                  item
                  lg={7}
                  md={7}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ pb: 3, textAlign: "center" }}>
                    Remittance Address
                  </Typography>
                  <Card sx={{ display: "flex", width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "space-around",
                      }}
                      key={editData._id}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData?.remittanceAddress.name}
                        </TableCell>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData?.remittanceAddress.email}
                        </TableCell>
                      </Box>

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Country
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData?.remittanceAddress.country}
                        </TableCell>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          State
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData?.remittanceAddress?.state}
                        </TableCell>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          City
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData.remittanceAddress.city}
                        </TableCell>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Street Address
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData.remittanceAddress.streetAddress}
                        </TableCell>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Zip Code
                        </TableCell>
                        <TableCell sx={{ width: "70%" }}>
                          {editData.remittanceAddress.zipCode}
                        </TableCell>
                      </Box>

                      {/* <TableCell></TableCell> */}
                    </Box>
                  </Card>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      pt: 3,
                      pb: 3,
                      width: "50%",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      fullWidth
                      onClick={()=>handlePost(editData)}
                    >
                      {loading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        "Accept Request"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Container>

          <Container maxWidth="lg">
            <Grid
              container
              spacing={3}
              sx={{ display: "flex", justifyContent: "center", mt: 3 }}
              style={{
                boxShadow: "#0000004a 1px 1px 18px",
                borderRadius: "10px",
              }}
            >
              {editData.token || editData.subscription ? (
                <Card sx={{ width: "100%" }}>
                  <Table>
                    {/* sx={{ background: "#5a82d7" }} */}
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {editData.token ? "token" : "Subscription"}
                        </TableCell>
                        <TableCell>
                          {editData.token ? "Coin" : "Payment Method"}
                        </TableCell>
                        <TableCell>
                          {editData.token ? "Circulating Supply" : "Price USD"}
                        </TableCell>

                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <Avatar
                              sx={{
                                mr: 2,
                                width: "55px",
                                height: "55px",
                                background: "#5048e5",
                              }}
                            >
                              <img
                                src={`${
                                  editData.token
                                    ? editData.token?.displaySymbol
                                    : editData.subscription?.logo
                                }`}
                                alt=""
                                style={{ width: "30px", height: "30px" }}
                              />
                            </Avatar>
                            <Box
                              sx={{
                                alignItems: "center",
                              }}
                            >
                              <Typography color="textPrimary" variant="h6">
                                {editData.token
                                  ? editData.token?.displayName
                                  : editData.subscription?.title}
                              </Typography>
                              <Typography
                                sx={{
                                  maxWidth: "350px",
                                  fontSize: "14px",
                                  fontWeight: "normal",
                                }}
                              >
                                {editData.token
                                  ? editData.token?.description
                                  : editData.subscription?.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {editData.token
                            ? editData.token?.coinSymbol
                            : editData.subscription?.paymentMethod}
                        </TableCell>

                        <TableCell>
                          {" "}
                          {editData.token
                            ? editData.token?.circulatingSupply.toFixed(3)
                            : editData.subscription?.priceUSD}
                        </TableCell>

                        <TableCell>
                          {moment(
                            editData.token
                              ? editData.token?.createdAt
                              : editData.subscription?.createdAt
                          ).format("DD/MM/YYYY hh:mm A")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                ""
              )}
            </Grid>
          </Container>
        </Box>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </div>
  );
};

export default FullScreenNFTDialog;
