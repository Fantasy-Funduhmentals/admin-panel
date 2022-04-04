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

  const [image, setImage] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editSymbolImage, setEditSymbolImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      //   metal: editData
      //     ? { name: editData?.name, symbol: editData?.coinSymbol }
      //     : null,
      name: editData ? editData?.name : "",
      description: editData ? editData?.description : "",
      //   isActive: editData ? editData?.isActive : false,
      pricePerShare: editData ? editData?.pricePerShare : "",
      //   pricePerShare: editData ? editData?.pricePerShare : "",
      //   remainingSupply: editData ? editData?.remainingSupply : "",
      //   decimals: editData ? editData?.decimals : "",
      //   icon: editData ? editData?.image : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      // metal: Yup.object({
      //   name: Yup.string().required("Coin name is required"),
      //   symbol: Yup.string().required("Coin symbol is required"),
      // }),
      name: Yup.string()
        .required("Coin name is required")
        .min(2, "Display name must be atleast 2 character")
        .max(50, "Display name must be atmost 50 character")
        .trim(),
      description: Yup.string().required("Description is required").trim(),
      pricePerShare: Yup.string()
        .min(1, "price Per Share must be atleast 1 character")
        .required("Description is required")
        .trim(),
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

  // function getMeta(url: any, callback: any) {
  //   var img = new Image();
  //   img.src = url;
  //   img.onload = function () {
  //     callback(width, height);
  //   };
  // }

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      setLoading(true);

      let params = {
        ...values,
        name: values.name,
        description: values.description,
        pricePerShare: String(values.pricePerShare),
        isActive: editData.isActive,
      };

      var myImg = document.querySelector("#city");
      var currWidth = myImg.clientWidth;
      var currHeight = myImg.clientHeight;
      if (currWidth !== currHeight) {
        setStatusData({
          type: "error",
          message: "Image must be in 1X1 ratio",
        });
        setLoading(false);
        return;
      }
      if (image) {
        const tokenImageUrl = await handleImageUpload(image, "nftTokens");
        params.image = tokenImageUrl;
      } else if (editImage) {
        params.image = editData.image;
      }
      if (editData) {
        params._id = editData._id;

        await updateNFT(params);
      } else {
        await createNewToken(params);
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
      setEditImage(null);
    }
  };

  useEffect(() => {
    if (editData) {
      setEditImage(editData?.image);

      // setImage(editData?.image);
      //   setEditSymbolImage(editData?.displaySymbol);
      // formik?.setFieldValue("metal", {
      //   name: editData?.name,
      //   symbol: editData?.coinSymbol,
      // });
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
              Token Registration
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
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <Card>
                  <CardHeader
                    subheader="This image will be used as primary token image in all apps."
                    title="Token Image"
                  />
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ visibility: "hidden", height: "0px" }}>
                        <img
                          src={
                            editImage
                              ? editImage
                              : image && URL.createObjectURL(image)
                          }
                          id="city"
                        />
                      </div>
                      <Avatar
                        src={
                          editImage
                            ? editImage
                            : image && URL.createObjectURL(image)
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

              <Grid item lg={8} md={6} xs={12}>
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Please enter all the required information to save new NFT."
                      title="NFT Information"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.name && formik.errors.name
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            fullWidth
                            label="NFT Name"
                            name="name"
                            helperText={formik.errors.name}
                            variant="outlined"
                          />
                        </Grid>

                        {/* <Grid item md={6} xs={12}>
                          <FormControl sx={{ m: 1, minWidth: "100%" }}>
                            <InputLabel id="demo-simple-select-helper-label">
                              {editData
                                ? formik.values.metal.name
                                : "Corresponding Metal"}
                            </InputLabel>
                            <Select
                              error={Boolean(
                                formik.touched.metal && formik.errors.metal
                              )}
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              value={formik.values.metal}
                              label={
                                editData
                                  ? formik.values.metal.name
                                  : "Corresponding Metal"
                              }
                              name="metal"
                              onChange={formik.handleChange}
                              disabled={Boolean(editData)}
                            >
                              {coins.map((coin, pricePerShare) => {
                                return (
                                  <MenuItem key={pricePerShare} value={coin}>
                                    {coin.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid> */}

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
                              formik.touched.pricePerShare &&
                                formik.errors.pricePerShare
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.pricePerShare}
                            fullWidth
                            type="number"
                            label="Price per share"
                            name="pricePerShare"
                            helperText={formik.errors.pricePerShare}
                            variant="outlined"
                          />
                        </Grid>

                        {/* <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.pricePerShare &&
                                formik.errors.pricePerShare
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.pricePerShare}
                            fullWidth
                            label="pricePerShare"
                            name="pricePerShare"
                            helperText="Please enter the hex of the color of corresponding token"
                            required
                            variant="outlined"
                          />
                        </Grid> */}

                        {/* <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.remainingSupply &&
                                formik.errors.remainingSupply
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.remainingSupply}
                            fullWidth
                            label="remainingSupply"
                            name="remainingSupply"
                            helperText="Please enter the order of the coin"
                            required
                            variant="outlined"
                          />
                        </Grid> */}

                        {/* <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.decimals && formik.errors.decimals
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.decimals}
                            fullWidth
                            label="Token Decimals"
                            name="decimals"
                            helperText="Please enter token decimals"
                            required
                            variant="outlined"
                          />
                        </Grid> */}
                      </Grid>
                    </CardContent>
                    <Divider />
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
                        {loading ? <CircularProgress /> : "Save details"}
                      </Button>
                    </Box>
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

export default FullScreenNFTDialog;
