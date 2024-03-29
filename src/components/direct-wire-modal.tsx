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
import React, { useEffect, useState } from "react";
import { getInitials } from "../utils/get-initials";
import StatusModal from "./StatusModal";
import { directWiresPost, singleDirectWire } from "../services/tokenService";
import { getNormalizedError } from "../utils/helpers";
import { DIRECT_WIRE } from "../utils/enums/request.enum";
import { RotatingLines } from "react-loader-spinner";

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
  const [modalLoading, setModalLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [singlewire, setSingleWire] = useState<any>({})
  const handlePost = async (editData) => {
    try {
      const data = {
        wireId: editData?._id,
      };
      setLoading(true);
      const res = await directWiresPost(data);

      setStatusData({
        type: "success",
        message: res.data.message,
      });
      setLoading(false);

      setTimeout(() => {
        onClose();
      });
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const getsingleWireData = async () => {
    try {
      setModalLoading(true)
      const response = await singleDirectWire(editData?._id)
      setSingleWire(response.data)
      setModalLoading(false)
    } catch (error) {
      setStatusData({
        type: "error",
        message: error,
      });
      onClose();
    }
  }

  useEffect(() => {
    getsingleWireData()
  }, [])

  let typeText = "";

  switch (editData?.type) {
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
          {modalLoading ? <Box sx={{ width: "100%", height: `${modalLoading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <RotatingLines
              strokeColor="#5048e5"
              strokeWidth="5"
              animationDuration="0.75"
              width="56"
              visible={true}
            />
          </Box> :
            <>
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
                      <Card sx={{ pb: 3 }}>
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
                            src={singlewire?.remittanceAddress?.signatureUrl}
                            sx={{ mr: 2, width: "120px", height: "120px" }}
                          >
                            {getInitials(singlewire?.remittanceAddress?.name)}
                          </Avatar>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Typography color="textPrimary" variant="h5">
                              {singlewire?.remittanceAddress?.name}
                            </Typography>
                            <Typography color="textSecondary" variant="h6">
                              {singlewire?.remittanceAddress?.email}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              mt: 2,
                              fontWeight: "bold",
                              fontSize: 20,
                              width: "80%",
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Order Detail
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              width: "80%",
                              // height: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                            style={{
                              boxShadow: "#0000004a 1px 1px 18px",
                              borderRadius: "10px",
                            }}
                          >
                            <Card
                              sx={{
                                width: "100%",
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "end",
                              }}
                            >
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      sx={{ fontWeight: "bold", width: "30%" }}
                                    >
                                      Amount
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: "bold", width: "30%" }}
                                    >
                                      Type
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    {/* <TableCell></TableCell> */}
                                    <TableCell>
                                      {singlewire?.amount?.toLocaleString()}
                                    </TableCell>

                                    <TableCell>{typeText}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Card>
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
                        Banking Details{" "}
                      </Typography>
                      <Card sx={{ display: "flex", width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            justifyContent: "space-around",
                          }}
                          key={singlewire?._id}
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
                              {singlewire?.remittanceAddress?.name}
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
                              {singlewire?.remittanceAddress?.email}
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
                              {singlewire?.remittanceAddress?.country}
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
                              {singlewire?.remittanceAddress?.state}
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
                              {singlewire?.remittanceAddress?.city}
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
                              {singlewire?.remittanceAddress?.streetAddress}
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
                              {singlewire?.remittanceAddress?.zipCode}
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
                            {/* <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Amount
                        </TableCell> */}
                            {/* <TableCell sx={{ width: "70%" }}>
                          {editData?.amount}
                        </TableCell> */}
                          </Box>
                          <Divider />
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                          Type
                        </TableCell> */}
                            {/* <TableCell sx={{ width: "70%" }}>
                          {capitalizeFirstLetter(editData?.type)}
                        </TableCell> */}
                          </Box>

                          {/* <TableCell></TableCell> */}
                        </Box>
                      </Card>
                      {editData?.status == "expired" ? (
                        <Typography
                          sx={{ color: "red", textAlign: "center", mt: 3 }}
                        >
                          This direct-wire has already been expired. Please be sure
                          before accepting this request. This action can not be
                          reversed.
                        </Typography>
                      ) : (
                        ""
                      )}

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
                        {editData.status == "expired" ? (
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={loading ? true : false}
                            onClick={() => handlePost(editData)}
                          >
                            {loading ? (
                              <CircularProgress color="inherit" />
                            ) : (
                              "Accept Request"
                            )}
                          </Button>
                        ) : (
                          ""
                        )}
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
                  {singlewire?.token || singlewire?.subscription ? (
                    <Card sx={{ width: "100%" }}>
                      <Table>
                        {/* sx={{ background: "#5a82d7" }} */}
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              {singlewire?.token ? "token" : "Subscription"}
                            </TableCell>
                            <TableCell>
                              {singlewire?.token ? "Coin" : "Payment Method"}
                            </TableCell>
                            <TableCell>
                              {singlewire?.token ? "Remaining Units" : "Price USD"}
                            </TableCell>

                            {/* <TableCell>Created At</TableCell> */}
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
                                    src={`${singlewire?.token
                                      ? singlewire?.token?.displaySymbol
                                      : singlewire?.subscription?.logo
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
                                    {singlewire?.token
                                      ? singlewire?.token?.shortName
                                      : singlewire?.subscription?.title}
                                  </Typography>
                                  {/* <Typography
                                sx={{
                                  maxWidth: "350px",
                                  fontSize: "14px",
                                  fontWeight: "normal",
                                }}
                              >
                                {editData.token
                                  ? editData.token?.description
                                  : editData.subscription?.description}
                              </Typography> */}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {singlewire?.token
                                ? singlewire?.token?.shortName
                                : singlewire?.subscription?.paymentMethod}
                            </TableCell>

                            <TableCell>
                              {" "}
                              {singlewire?.token
                                ? singlewire?.token?.remainingSupply?.toLocaleString()
                                : singlewire?.subscription?.priceUSD}
                            </TableCell>

                            {/* <TableCell>
                          {moment(
                            editData.token
                              ? editData.token?.createdAt
                              : editData.subscription?.createdAt
                          ).format("DD/MM/YYYY hh:mm A")}
                        </TableCell> */}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    ""
                  )}
                </Grid>
              </Container>
            </>
          }
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
