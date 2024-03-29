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
  Modal,
  TextareaAutosize,
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
import { truncate } from "fs";
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

const PendingDirectWireModal = (props: Props) => {
  const { open, onClose, editData } = props;
  const [wireDetail, setWireDetail] = useState<any>("");
  const [statusData, setStatusData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectShow, setRejectShow] = useState(false);
  const [textArea, settextArea] = useState("");
  const [singlewire, setSingleWire] = useState<any>({})
  const handleClose = () => {
    setRejectShow(false);
  };

  const handleRejectOpen = (data) => {
    setRejectShow(true);
    setWireDetail(data);
  };

  const handleTextAreaChange = (e) => {
    settextArea(e.target.value);
  };

  const handlePost = async (editData, name) => {
    try {
      let data;

      data = {
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
  const handleReject = async (editData, name) => {
    try {
      let data;
      if (!textArea) {
        setStatusData({
          type: "error",
          message: "please describe reason first",
        });
        return;
      }
      data = {
        wireId: wireDetail?._id,
        rejectionReason: textArea,
        isRejected: true,
      };

      setRejectLoading(true);
      const res = await directWiresPost(data);

      setStatusData({
        type: "success",
        message: res.data.message,
      });
      setRejectLoading(false);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setRejectLoading(false);
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
    <>
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
                width="66"
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
                              <Typography variant="h5" color="textPrimary">
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
                                        {(singlewire?.amount)?.toLocaleString()}
                                      </TableCell>

                                      <TableCell>
                                        {/* {capitalizeFirstLetter(editData?.type)} */}
                                        {typeText}
                                      </TableCell>
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
                        <Typography
                          variant="h4"
                          sx={{ pb: 3, textAlign: "center" }}
                        >
                          Banking Details
                        </Typography>
                        <Card sx={{ display: "flex", width: "100%" }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              justifyContent: "space-around",
                            }}
                            key={singlewire._id}
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
                                {singlewire.remittanceAddress?.city}
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
                                {singlewire.remittanceAddress?.streetAddress}
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

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            columnGap: "10px",
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
                            disabled={loading ? true : false}
                            onClick={() => handlePost(editData, "accept")}
                          >
                            {loading ? (
                              <CircularProgress color="inherit" />
                            ) : (
                              "Accept Request"
                            )}
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            fullWidth
                            onClick={() => handleRejectOpen(editData)}
                          >
                            Reject Request
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
                    {singlewire?.token || singlewire?.subscription ? (
                      <Card sx={{ width: "100%" }}>
                        <Table>
                          {/* sx={{ background: "#5a82d7" }} */}
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                {singlewire.token ? "token" : "Subscription"}
                              </TableCell>
                              <TableCell>
                                {singlewire.token ? "Coin" : "Payment Method"}
                              </TableCell>
                              <TableCell>
                                {singlewire.token ? "Remaining Units" : "Price USD"}
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
                                      src={`${singlewire.token
                                        ? singlewire.token?.displaySymbol
                                        : singlewire.subscription?.logo
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
                                      {singlewire.token
                                        ? singlewire.token?.shortName
                                        : singlewire.subscription?.title}
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
                                {singlewire.token
                                  ? singlewire.token?.shortName
                                  : singlewire.subscription?.paymentMethod}
                              </TableCell>

                              <TableCell>
                                {" "}
                                {singlewire.token
                                  ? singlewire.token?.remainingSupply?.toLocaleString()
                                  // .toFixed(3)

                                  : singlewire.subscription?.priceUSD}
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
      {/* <Modal
        style={{ margin: 0, position: "absolute", top: "50%", left: "50%" }}
        open={rejectShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal> */}
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={rejectShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: 5,
            boxShadow: 60,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please Describe rejection reason
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            // placeholder="Minimum 3 rows"
            style={{ width: 300, resize: "none", height: "200px" }}
            onChange={(e) => handleTextAreaChange(e)}
          />
          <Button
            style={{ width: 300 }}
            color="primary"
            variant="contained"
            type="submit"
            fullWidth
            onClick={() => handleReject("", "reject")}
          >
            {rejectLoading ? <CircularProgress color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PendingDirectWireModal;
