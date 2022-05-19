import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box, height, width } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { uploadImage } from "../services/generalService";
import {
  createNewToken,
  updateToken,
  updateNFT,
} from "../services/tokenService";
import { getInitials } from "../utils/get-initials";
import { getNormalizedError } from "../utils/helpers";
import StatusModal from "./StatusModal";

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

const coins = [
  { name: "gold", symbol: "Au" },
  { name: "silver", symbol: "Ag" },
  { name: "platinum", symbol: "Pt" },
  { name: "palladium", symbol: "Pd" },
  { name: "iridium", symbol: "Ir" },
  { name: "rhodium", symbol: "Rh" },
  { name: "ruthenium", symbol: "Ru" },
  { name: "aluminum", symbol: "Al" },
  { name: "nickel", symbol: "Ni" },
  { name: "copper", symbol: "Cu" },
  { name: "lead", symbol: "Pb" },
  { name: "tin", symbol: "Sn" },
  { name: "zinc", symbol: "Zn" },
  { name: "cobalt", symbol: "Co" },
  { name: "bronze", symbol: "CuSn" },
];

const FullScreenNFTDialog = (props: Props) => {
  const { open, onClose, editData } = props;
  console.log(editData, "<<<<<<<<<<<<<<<<<<<");

  const [image, setImage] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editSymbolImage, setEditSymbolImage] = useState(null);

  // const formik = useFormik({
  //   initialValues: {
  //     //   metal: editData
  //     //     ? { name: editData?.name, symbol: editData?.coinSymbol }
  //     //     : null,
  //     name: editData ? editData?.name : "",
  //     description: editData ? editData?.description : "",
  //     //   isActive: editData ? editData?.isActive : false,
  //     pricePerShare: editData ? editData?.pricePerShare : "",
  //     //   pricePerShare: editData ? editData?.pricePerShare : "",
  //     //   remainingSupply: editData ? editData?.remainingSupply : "",
  //     //   decimals: editData ? editData?.decimals : "",
  //     //   icon: editData ? editData?.image : "",
  //   },
  //   enableReinitialize: true,
  //   validationSchema: Yup.object({
  //     // metal: Yup.object({
  //     //   name: Yup.string().required("Coin name is required"),
  //     //   symbol: Yup.string().required("Coin symbol is required"),
  //     // }),
  //     name: Yup.string()
  //       .required("Coin name is required")
  //       .min(2, "Display name must be atleast 2 character")
  //       .max(50, "Display name must be atmost 50 character")
  //       .trim(),
  //     description: Yup.string().required("Description is required").trim(),
  //     pricePerShare: Yup.string()
  //       .min(1, "price Per Share must be atleast 1 character")
  //       .required("Price per share is required")
  //       .trim(),
  //   }),
  //   onSubmit: (values, actions) => {
  //     handleSubmit(values, actions);
  //   },
  // });

  // const handleImageUpload = async (file: any, type: string) => {
  //   const formData = new FormData();

  //   formData.append("file", file);
  //   formData.append("type", type);

  //   const uploadRes = await uploadImage(formData);
  //   return uploadRes.data.url;
  // };

  // function getMeta(url: any, callback: any) {
  //   var img = new Image();
  //   img.src = url;
  //   img.onload = function () {
  //     callback(width, height);
  //   };
  // }

  // const handleSubmit = async (values, actions) => {
  //   try {
  //     setStatusData(null);
  //     setLoading(true);

  //     let params = {
  //       ...values,
  //       name: values.name,
  //       description: values.description,
  //       pricePerShare: String(values.pricePerShare),
  //       isActive: editData.isActive,
  //     };

  //     var myImg = document.querySelector("#city");
  //     var currWidth = myImg.clientWidth;
  //     var currHeight = myImg.clientHeight;
  //     if (currWidth !== currHeight) {
  //       setStatusData({
  //         type: "error",
  //         message: "Image must be in 1X1 ratio",
  //       });
  //       setLoading(false);
  //       return;
  //     }
  //     if (image) {
  //       const tokenImageUrl = await handleImageUpload(image, "nftTokens");
  //       params.image = tokenImageUrl;
  //     } else if (editImage) {
  //       params.image = editData.image;
  //     }
  //     if (editData) {
  //       params._id = editData._id;

  //       await updateNFT(params);
  //     } else {
  //       await createNewToken(params);
  //     }

  //     formik.resetForm();
  //     setImage(null);
  //     setSymbolImage(null);
  //     onClose();
  //     setStatusData({
  //       type: "success",
  //       message: "Token has been created successfully",
  //     });
  //     setLoading(false);
  //   } catch (err) {
  //     const error = getNormalizedError(err);
  //     setStatusData({
  //       type: "error",
  //       message: error,
  //     });
  //     setLoading(false);
  //   }
  // };

  // const handleImageSelection = (event: any) => {
  //   if (event.target.files && event.target.files[0]) {
  //     let img = event.target.files[0];

  //     setImage(img);
  //     setEditImage(null);
  //   }
  // };

  // useEffect(() => {
  //   if (editData) {
  //     setEditImage(editData?.image);

  //     // setImage(editData?.image);
  //     //   setEditSymbolImage(editData?.displaySymbol);
  //     // formik?.setFieldValue("metal", {
  //     //   name: editData?.name,
  //     //   symbol: editData?.coinSymbol,
  //     // });
  //   }
  // }, []);

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

                <Grid item lg={7} md={7} xs={12} sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <Typography variant="h4" sx={{ pb: 3, textAlign: "center" }}>
                    Remittance Address
                  </Typography>
                  <Card sx={{ display: "flex",width:"100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "40%",
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Name
                      </TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Email
                      </TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>Street Address</TableCell>
                      <Divider />
                      <TableCell sx={{ fontWeight: "bold" }}>Zip Code</TableCell>
                      {/* <TableCell></TableCell> */}
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column",width:"60%" }}
                      key={editData._id}
                    >
                      <TableCell>{editData?.remittanceAddress.name}</TableCell>
                      <Divider />
                      <TableCell>{editData?.remittanceAddress.email}</TableCell>
                      <Divider />
                      <TableCell>{editData?.remittanceAddress.country}</TableCell>
                      <Divider />
                      <TableCell>
                        {editData?.remittanceAddress?.state}
                      </TableCell>
                      <Divider />
                      <TableCell>{editData.remittanceAddress.city}</TableCell>
                      <Divider />
                      <TableCell>{editData.remittanceAddress.streetAddress}</TableCell>
                      <Divider />
                      <TableCell>{editData.remittanceAddress.zipCode}</TableCell>

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
