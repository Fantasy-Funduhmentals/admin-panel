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
import React, { useState } from "react";
import * as Yup from "yup";
import {
  changesImageUrl,
  postShopData,
  updateShopData,
} from "../../services/shopService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
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
  getShopListing?: () => void;
}

const AddShopModal = (props: Props) => {
  const { open, onClose, editData, getShopListing } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl]: any = useState("");

  const formik = useFormik({
    initialValues: {
      title: editData ? editData?.title : "",
      coinSymbolName: editData ? editData?.coinSymbol : "",
      productURL: editData ? editData.productURL : "",
      price: editData ? editData?.price : "",
      files: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Enter Your title").min(2).max(50).trim(),
      coinSymbolName: Yup.string().required("Enter Your coin symbol name"),
      productURL: Yup.string().required("Enter Your url"),
      files: Yup.mixed(),
      price: Yup.number()
        .positive("positive value only")
        .required("price is price"),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const uploadRes = await changesImageUrl(formData);
    return uploadRes.data.url;
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      setLoading(true);
      if (values.files != null) {
        const coverPhotoImage = await handleImageUpload(
          values.files[0],
          "coinImage"
        );
        setImageUrl(coverPhotoImage);
      }

      let params = {
        title: values.title,
        price: Number(values.price),
        coinSymbol: values.coinSymbolName,
        mediaURL: imageUrl == "" ? editData.mediaURL : imageUrl,
        productURL: values.productURL,
      };

      if (editData != null) {
        let updateParams = {
          ...params,
          id: editData._id,
        };
        const res = await updateShopData(updateParams);
        setStatusData({
          type: "success",
          message: res?.data?.message,
        });
      } else {
        const res = await postShopData(params);
        setStatusData({
          type: "success",
          message: res?.data?.message,
        });
      }

      formik.resetForm();
      onClose();
      getShopListing();
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

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              background: "#232325",
              boxShadow:
                "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              User Registration
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#111112",
          }}
        >
          <Container maxWidth="lg">
            <Grid>
              <form onSubmit={formik.handleSubmit}>
                <Card>
                  <Grid item lg={4} md={6} xs={12}>
                    <CardHeader
                      subheader="This image will be used as symbol image."
                      title="Symbol Image"
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
                            editData
                              ? editData?.mediaURL
                              : formik?.values?.files &&
                                URL?.createObjectURL(formik?.values?.files[0])
                          }
                          sx={{
                            height: 104,
                            mb: 2,
                            width: 104,
                          }}
                        />
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <TextField
                        type="file"
                        onChange={(ev: any) => {
                          if (ev?.target?.files)
                            formik.setFieldValue("files", ev?.target?.files);
                        }}
                        error={Boolean(
                          formik.touched.files && formik.errors.files
                        )}
                        color="success"
                      />
                    </Box>
                  </Grid>

                  <Grid item lg={8} md={6} xs={12}>
                    <CardHeader
                      subheader="Please enter all the required information."
                      title="Shop Details"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.title && formik.errors.title
                            )}
                            fullWidth
                            helperText="Please enter the title."
                            label="Title"
                            name="title"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            required
                            value={formik.values.title}
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.price && formik.errors.price
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.price}
                            fullWidth
                            label="Price"
                            name="price"
                            helperText="Please enter price."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.coinSymbolName &&
                                formik.errors.coinSymbolName
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.coinSymbolName}
                            fullWidth
                            label="Coin Symbol Name"
                            name="coinSymbolName"
                            helperText="Please enter the coin symbol name."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.productURL &&
                                formik.errors.productURL
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.productURL}
                            fullWidth
                            label="Product URL"
                            name="productURL"
                            helperText="Please enter the product url."
                            required
                            variant="outlined"
                            color="success"
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
                      {loading ? (
                        <Button
                          color="primary"
                          variant="contained"
                          type="button"
                          fullWidth
                        >
                          <CircularProgress color="inherit" />
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          fullWidth
                        >
                          Save details
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Card>
              </form>
            </Grid>
          </Container>
        </Box>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Box>
  );
};

export default AddShopModal;
