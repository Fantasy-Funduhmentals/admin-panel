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
  NativeSelect,
  FormControl,
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
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { uploadImage } from "../services/generalService";
import {
  createSubscription,
  updateSubscription,
} from "../services/tokenService";
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

const FullScreenDialog = (props: Props) => {
  const { open, onClose, editData } = props;

  const [image, setImage] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editSymbolImage, setEditSymbolImage] = useState(null);
  const [duration, setDuration] = React.useState("month");
  const [payment, setPayment] = React.useState("fiat");

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handlePaymentChange = (event) => {
    setPayment(event.target.value);
  };

  // console.log("editData:::", editData);

  const formik = useFormik({
    initialValues: {
      //   metal: editData
      //     ? { name: editData?.name, symbol: editData?.coinSymbol }
      //     : null,
      title: editData ? editData?.title : "",
      // paymentMethod: editData ? editData?.paymentMethod : "",
      isActive: editData ? editData?.isActive : false,
      // duration: editData ? editData?.duration : "",
      description: editData ? editData?.description : "",
      priceUSD: editData ? editData?.priceUSD : "",
      apr: editData ? editData?.apr : "",
      //   icon: editData ? editData?.icon : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      //   metal: Yup.object({
      //     name: Yup.string().required("Coin name is required"),
      //     symbol: Yup.string().required("Coin symbol is required"),
      //   }),

      title: Yup.string()
        .required("Name is required")
        .min(2, "Name must be atleast 2 character")
        .max(50, "Name must be atmost 50 character")
        .trim(),
      // paymentMethod: Yup.string().required("Payment method is required").trim(),
      // duration: Yup.string()
      //   .required("duration is required")
      //   .min(2, "duration must be atleast 2 character")
      //   .trim(),
      description: Yup.string().required("Description is required").trim(),
      priceUSD: Yup.string().required("Price is required").trim(),
      apr: Yup.string().required("apr is required").trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", type);

    const uploadRes = await uploadImage(formData);
    return uploadRes.data.url;
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      if (!image && !editData) {
        setStatusData({
          type: "error",
          message: "Please select an image to continue",
        });
        return;
      }

      setLoading(true);

      let params = {
        ...values,
        title: values.title,
        description: values.description,
        priceUSD: String(values.priceUSD),
        paymentMethod: payment,
        duration: duration,
        apr: String(values.apr),
      };
      if (image) {
        const tokenImageUrl = await handleImageUpload(image, "nativeTokens");
        params.logo = String(tokenImageUrl);
      } else {
        params.logo = editData.logo;
      }
      if (editData) {
        params._id = editData._id;
        await updateSubscription(params);
      } else {
        await createSubscription(params);
      }

      formik.resetForm();
      setImage(null);
      setSymbolImage(null);
      onClose();
      setStatusData({
        type: "success",
        message: "Token has been created successfully",
      });
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  const handleImageSelection = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
      setSymbolImage(event.target.files[0]);
      setEditSymbolImage(null);
    }
  };

  useEffect(() => {
    if (editData) {
      setEditSymbolImage(editData?.logo);
      setDuration(editData?.duration);
      setPayment(editData?.paymentMethod);
    }
  }, []);

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
              Package
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
            <Grid container spacing={3}  style={{    boxShadow: "rgb(0 0 0 / 29%) 1px 1px 18px",
    borderRadius:" 10px"}}>
              <Grid item lg={4} md={6} xs={12}>
                <Card>
                  <CardHeader
                    // subheader="This image will be used as token symbol in all apps."
                    title="Plan Image"
                  />
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Avatar
                        src={
                          editSymbolImage
                            ? editSymbolImage
                            : symbolImage && URL.createObjectURL(symbolImage)
                        }
                        sx={{
                          height: 64,
                          mb: 2,
                          width: 64,
                        }}
                      />
                    </Box>
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      type="file"
                      onChange={(ev) => handleImageSelection(ev)}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item lg={8} md={6} xs={12} >
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Please enter all the required information to save new token."
                      title="  Information"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.title && formik.errors.title
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.title}
                            fullWidth
                            label="Title"
                            name="title"
                            helperText={formik.errors.title}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}></Grid>
                        <Grid item md={6} xs={12}>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Payment Method
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={payment}
                                label="Payment Method"
                                onChange={handlePaymentChange}
                              >
                                <MenuItem value={"fiat"}>Fiat </MenuItem>
                                <MenuItem value={"crypto"}>Crypto </MenuItem>
                                <MenuItem value={"nativeToken"}>
                                  NativeToken{" "}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Duration
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={duration}
                                label="Duration"
                                onChange={handleDurationChange}
                              >
                                <MenuItem value={"month"}>1 Month</MenuItem>
                                <MenuItem value={"threeMonths"}>
                                  3 Months
                                </MenuItem>
                                <MenuItem value={"yearly"}>1 Year</MenuItem>
                                <MenuItem value={"10 minutes"}>
                                  10 minutes
                                </MenuItem>
                                <MenuItem value={"20 minutes"}>
                                  20 minutes
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.description &&
                                formik.errors.description
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            fullWidth
                            label="Description"
                            name="description"
                            helperText={formik.errors.description}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.priceUSD && formik.errors.priceUSD
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.priceUSD}
                            fullWidth
                            label="Price USD"
                            type="number"
                            name="priceUSD"
                            helperText={formik.errors.priceUSD}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.apr && formik.errors.apr
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.apr}
                            fullWidth
                            label="Apr"
                            type="number"
                            name="apr"
                            helperText={formik.errors.apr}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider />
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 2,
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          fullWidth
                        >
                          Save details
                        </Button>
                      </Box>
                    )}
                  </Card>
                </form>
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

export default FullScreenDialog;
