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
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { uploadImage } from "../services/generalService";
import { createNewToken, updateToken } from "../services/tokenService";
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
  // console.log("editData::::", editData);

  const [image, setImage] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editSymbolImage, setEditSymbolImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      metal: editData
        ? { name: editData?.name, symbol: editData?.coinSymbol }
        : null,
      displayName: editData ? editData?.displayName : "",
      totalSupply: editData ? editData?.totalSupply : "",
      isActive: editData ? editData?.isActive : false,
      description: editData ? editData?.description : "",
      coinColor: editData ? editData?.coinColor : "",
      orderIndex: editData ? editData?.orderIndex : "",
      decimals: editData ? editData?.decimals : "",
      icon: editData ? editData?.icon : "",
      multiplier: editData ? editData?.multiplier : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      metal: Yup.object({
        name: Yup.string().required("Coin name is required"),
        symbol: Yup.string().required("Coin symbol is required"),
      }),

      displayName: Yup.string()
        .required("Coin name is required")
        .min(1, "Display name must be atleast 2 character")
        .max(50, "Display name must be atmost 50 character")
        .trim(),
      totalSupply: Yup.string().required("Total Supply is required").trim(),
      description: Yup.string()
        .min(2, "Description must be atleast 2 character")
        .required("Description is required")
        .trim(),
      coinColor: Yup.string().required("Coin Color is required").trim(),
      orderIndex: Yup.string().required("Order Index is required").trim(),
      decimals: Yup.string().required("Decimals is required").trim(),
      multiplier: Yup.string().required("multiplier is required").trim(),
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
      } else if (!symbolImage && !editData) {
        setStatusData({
          type: "error",
          message: "Please select an symbol image to continue",
        });
        return;
      }

      setLoading(true);

      let params = {
        ...values,
        name: values.metal.name,
        coinSymbol: values.metal.symbol,
        isActive: true,
        orderIndex: String(values.orderIndex),
      };

      if (editData) {
        params.icon = editData.icon.url;
        params.displaySymbol = editData.displaySymbol;
      }

      if (image) {
        const tokenImageUrl = await handleImageUpload(image, "nativeTokens");
        params.icon = tokenImageUrl;
      }

      if (symbolImage) {
        const tokensymbolUrl = await handleImageUpload(
          symbolImage,
          "tokenFonts"
        );
        params.displaySymbol = tokensymbolUrl;
      }

      if (editData) {
        params._id = editData._id;

        await updateToken(params);
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

  const handleImageSelection = (event: any, type: "token" | "symbol") => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      if (type == "token") {
        setImage(img);
        setEditImage(null);
      } else if (type == "symbol") {
        setSymbolImage(event.target.files[0]);
        setEditSymbolImage(null);
      }
    }
  };

  useEffect(() => {
    if (editData) {
      setEditImage(editData.icon.url);
      setEditSymbolImage(editData.displaySymbol);
      formik?.setFieldValue("metal", {
        name: editData?.name,
        symbol: editData?.coinSymbol,
      });
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
            <Grid
              container
              spacing={3}
              style={{
                boxShadow: "rgb(0 0 0 / 29%) 1px 1px 18px",
                borderRadius: " 10px",
              }}
            >
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
                      onChange={(ev) => handleImageSelection(ev, "token")}
                    />
                  </Box>
                </Card>
                <Card>
                  <CardHeader
                    subheader="This image will be used as token symbol in all apps."
                    title="Token Symbol Image"
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
                      onChange={(ev) => handleImageSelection(ev, "symbol")}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item lg={8} md={6} xs={12}>
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Please enter all the required information to save new token."
                      title="Token Information"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.displayName &&
                                formik.errors.displayName
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.displayName}
                            fullWidth
                            label="Display Name"
                            name="displayName"
                            helperText="Please enter the display name of the token"
                            required
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
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
                              {coins.map((coin, index) => {
                                return (
                                  <MenuItem key={index} value={coin}>
                                    {coin.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.totalSupply &&
                                formik.errors.totalSupply
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.totalSupply}
                            fullWidth
                            label="Total Supply"
                            name="totalSupply"
                            required
                            variant="outlined"
                          />
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
                            // helperText="Please enter token description"

                            required
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.coinColor &&
                                formik.errors.coinColor
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.coinColor}
                            fullWidth
                            label="Coin Color"
                            name="coinColor"
                            helperText="Please enter the hex of the color of corresponding token"
                            required
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.orderIndex &&
                                formik.errors.orderIndex
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.orderIndex}
                            fullWidth
                            label="Order Index"
                            name="orderIndex"
                            helperText="Please enter the order of the coin"
                            required
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
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
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.multiplier &&
                                formik.errors.multiplier
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.multiplier}
                            fullWidth
                            label="Multiplier"
                            name="multiplier"
                            helperText="Please enter multiplier"
                            required
                            variant="outlined"
                          />
                        </Grid>
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
                        {loading ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          "Save details"
                        )}
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

export default FullScreenDialog;
