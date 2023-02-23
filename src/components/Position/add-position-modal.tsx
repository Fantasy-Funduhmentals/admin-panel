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
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ClearTwoToneIcon from "@mui/icons-material/ClearTwoTone";
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
import { NavItem } from "../nav-item";
import { postPsitionData, updatePsitionData } from "../../services/teamService";
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

const AddPositionModal = (props: Props) => {
  const { open, onClose, editData, getShopListing } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alignment, setAlignment] = useState("false");
  const [incremantState, setIncrementstate] = useState("true");
  const [selectedGalleryImage, setselectedGalleryImage] = useState(null);
  const [gallaryPhotos, setGalleryImages] = useState([]);
  const [imageUrl, setImageUrl]: any = useState("");
  const [sizeData, setSizeData] = useState([
    {
      id: 0,
      size: "",
      totalprice: null,
      totalstockavailable: null,
    },
  ]);

  const formik = useFormik({
    initialValues: {
      title: editData ? editData?.title : "",
      winStages: editData ? editData?.winStages : "",
      losersDeductionPercentage: editData
        ? editData?.losersDeductionPercentage
        : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required").min(2).max(50).trim(),
      winStages: Yup.number().required("Enter Win Stage"),
      losersDeductionPercentage: Yup.number().required(
        "Enter Losers Deduction Percentage"
      ),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  // const handleImageUpload = async (file: any, type: string) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("type", type);
  //   const uploadRes = await changesImageUrl(formData);
  //   return uploadRes.data.url;
  // };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setStatusData(null);
      // if (gallaryPhotos?.length === 0 && !editData) {
      //   setStatusData({
      //     type: "error",
      //     message: "Please select an gallery images to continue",
      //   });
      //   return;
      // }
      // if (+formik.values.losersDeductionPercentage >= +formik.values.price) {
      //   setStatusData({
      //     type: "error",
      //     message: "Discount price should be less then total price",
      //   });

      //   return;
      // }
      setLoading(true);
      let params = {
        title: values.title,
        winStages: values.winStages,
        losersDeductionPercentage: values.losersDeductionPercentage,
      };
      if (editData != null) {
        let updateParams = {
          ...params,
        };
        const res = await updatePsitionData(updateParams, editData?._id);
        setStatusData({
          type: "success",
          message: res?.data?.message,
        });
      } else {
        const res = await postPsitionData(params);
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
  const handleChange = async (e) => {
    if (e.target.value == "false") {
      setLoading(true);
      if (alignment == "false") {
        setLoading(false);
        return;
      }
      setAlignment(e.target.value);
      setLoading(false);
    } else if (e.target.value == "true") {
      setAlignment(e.target.value);
    }
  };
  const handleClickOpen = (e) => {
    if (alignment == "ON") {
      return;
    }
  };
  const activeState = [
    {
      name: "YES",
      value: 0,
    },
    {
      name: "NO",
      value: 1,
    },
  ];
  // const fileSelectedHandler = async (file: any) => {
  //   const tokenImageUrl = await handleImageUpload(
  //     file?.target?.files[0],
  //     "coinImage"
  //   );
  //   setselectedGalleryImage(file?.target?.files[0]);
  //   gallaryPhotos.push(tokenImageUrl);
  //   return;
  // };
  const handleRemovegalleryImage = (data: any, index: number) => {
    const uploadedFiles = data;
    const filtered = gallaryPhotos.filter((i, ind) => {
      return i !== gallaryPhotos[index];
    });
    setGalleryImages([...filtered]);
  };
  const sizeAvailable = [
    {
      id: 1,
      size: "S",
    },
    {
      id: 2,
      size: "M",
    },
    {
      id: 3,
      size: "L",
    },
    {
      id: 4,
      size: "XL",
    },
  ];
  const handleToogleButton = async (e) => {
    setIncrementstate(e.target.value);
    if (e.target.value == "false") {
      recieveData(false);
    } else {
      if (sizeData.length < 4) {
        recieveData(true);
      }
    }
  };

  const recieveData = (data: boolean) => {
    if (data) {
      setSizeData([
        ...sizeData,
        {
          id: sizeData.length,
          size: "",
          totalprice: null,
          totalstockavailable: null,
        },
      ]);
    } else {
      setSizeData([...sizeData.slice(0, -1)]);
    }
  };
  const handleInputchange = (
    event: any,
    selectedInputItem: any,
    fieldType: string,
    index?: any
  ) => {
    let cloneArray = [...sizeData];

    const ind = sizeData.findIndex((item) => item.id === selectedInputItem.id);
    cloneArray[ind][fieldType] = event.target.value;
    setSizeData(cloneArray);
  };
  const handlelosersDeductionPercentage = (e: any) => {
    // if (+e.target.value >= formik.values.price) {
    //   alert("Discount price should be less then total price");
    //   return;
    // e.target.value = "";
    // formik.resetForm(formik.values.losersDeductionPercentage);
    // actions.resetForm({
    //   values: {
    //     losersDeductionPercentage: initialValues.losersDeductionPercentage
    //   }
    // });
    // formik.resetForm({
    //   values: { ...formik.values, losersDeductionPercentage: "" },
    // });
    // }
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
              Position
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
                  {/* <Grid item lg={4} md={6} xs={12}>
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
                            selectedGalleryImage &&
                            URL?.createObjectURL(selectedGalleryImage)
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
                        inputProps={{
                          accept: "image/*",
                        }}
                        // onChange={(ev) => fileSelectedHandler(ev)}
                        onChange={(ev: any) => {
                          if (ev?.target?.files)
                            // formik.setFieldValue("files", ev?.target?.files);
                            fileSelectedHandler(ev);
                        }}
                        // error={Boolean(
                        //   formik.touched.files && formik.errors.files
                        // )}
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Grid item container spacing={2} px={3}>
                        {gallaryPhotos &&
                          gallaryPhotos.length > 1 &&
                          gallaryPhotos?.map((img, index) => {
                            return (
                              <Grid
                                item
                                md={3}
                                xs={12}
                                sx={{
                                  marginTop: "1rem",
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: "#11111273",
                                    height: "130px",
                                    width: "120px",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      position: "relative",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <ClearTwoToneIcon
                                      onClick={() =>
                                        handleRemovegalleryImage(img, index)
                                      }
                                      style={{
                                        width: "19px",
                                        height: "100%",
                                      }}
                                    />
                                  </Box>
                                  <img src={img} width={100} height={100} />
                                </Box>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Box>
                  </Grid> */}

                  <Grid item lg={8} md={6} xs={12}>
                    <CardHeader
                      subheader="Please enter all the required information."
                      title="Position Details"
                    />

                    {/* <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pr: 3,
                        boxShadow: "0px 0px 10px #111112",
                      }}
                    >
                      <CardHeader title="Variant" />
                      <ToggleButtonGroup
                        sx={{ height: "20%" }}
                        color="success"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                      >
                        <ToggleButton
                          value="true"
                          onClick={(e) => handleClickOpen(e)}
                        >
                          True
                        </ToggleButton>
                        <ToggleButton value="false" color="success">
                          False
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box> */}
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <InputLabel
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Please enter the title.
                          </InputLabel>
                          <TextField
                            error={Boolean(
                              formik.touched.title && formik.errors.title
                            )}
                            helperText={
                              formik.touched.title && formik.errors.title
                            }
                            fullWidth
                            type="text"
                            label="Title"
                            name="title"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.title}
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <InputLabel
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Please enter price in ADA.
                          </InputLabel>
                          <TextField
                            error={Boolean(
                              formik.touched.winStages &&
                                formik.errors.winStages
                            )}
                            helperText={
                              formik.touched.winStages &&
                              formik.errors.winStages
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.winStages}
                            fullWidth
                            type="number"
                            label="Win Stages"
                            name="winStages"
                            variant="outlined"
                            color="success"
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <InputLabel
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Enter deduction price
                          </InputLabel>
                          <TextField
                            error={Boolean(
                              formik.touched.losersDeductionPercentage &&
                                formik.errors.losersDeductionPercentage
                            )}
                            helperText={
                              formik.touched.losersDeductionPercentage &&
                              formik.errors.losersDeductionPercentage
                            }
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              formik.handleChange(e),
                                handlelosersDeductionPercentage(e);
                            }}
                            value={formik.values.losersDeductionPercentage}
                            fullWidth
                            type="number"
                            label="Discount Price"
                            name="losersDeductionPercentage"
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        {/* 
                        <Grid item md={6} xs={12}>
                          <InputLabel
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Please enter the shopping charges in ADA
                          </InputLabel>
                          <TextField
                            error={Boolean(
                              formik.touched.shoppingChargres &&
                                formik.errors.shoppingChargres
                            )}
                            helperText={
                              formik.touched.shoppingChargres &&
                              formik.errors.shoppingChargres
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.shoppingChargres}
                            fullWidth
                            type="number"
                            label="Shopping Charges"
                            name="shoppingChargres"
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <InputLabel
                            sx={{
                              marginBottom: "10px",
                            }}
                          >
                            Please enter the total quantity.
                          </InputLabel>
                          <TextField
                            error={Boolean(
                              formik.touched.totalQuantity &&
                                formik.errors.totalQuantity
                            )}
                            helperText={
                              formik.touched.totalQuantity &&
                              formik.errors.totalQuantity
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.totalQuantity}
                            fullWidth
                            type="number"
                            label="Total Quantity"
                            name="totalQuantity"
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth>
                            <InputLabel
                              id="demo-simple-select-helper-label"
                              color="success"
                            >
                              Active on market
                            </InputLabel>
                            <Select
                              error={Boolean(
                                formik.touched.active && formik.errors.active
                              )}
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              value={formik.values.active}
                              label="Is Active"
                              name="active"
                              color="success"
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                            >
                              {activeState?.map((item: any, index: number) => {
                                return (
                                  <MenuItem key={index} value={item?.name}>
                                    {item.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {formik.errors.active &&
                            formik.touched.active === null ? (
                              <div
                                style={{
                                  color: "red",
                                }}
                              >
                                {formik.errors.active}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        {alignment === "true" ? (
                          <>
                            <Grid item container spacing={2} md={12} xs={12}>
                              <Grid item md={12} xs={12}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    pr: 3,
                                    boxShadow: "0px 0px 10px #111112",
                                  }}
                                >
                                  <CardHeader title="Size Information" />
                                  <ToggleButtonGroup
                                    sx={{ height: "20%" }}
                                    color="success"
                                    value={incremantState}
                                    exclusive
                                    onChange={handleToogleButton}
                                  >
                                    <ToggleButton value="false">-</ToggleButton>
                                    <ToggleButton value="true" color="success">
                                      +
                                    </ToggleButton>
                                  </ToggleButtonGroup>
                                </Box>
                              </Grid>
                              <Grid item md={12} xs={12}>
                                {sizeData?.map((item, index) => {
                                  return (
                                    <>
                                      <form id="sizes">
                                        <Grid
                                          item
                                          container
                                          spacing={4}
                                          md={12}
                                          xs={12}
                                          sx={{ padding: "10px" }}
                                        >
                                          <Grid item md={4} xs={12}>
                                            <FormControl fullWidth>
                                              <InputLabel
                                                id="demo-simple-select-helper-label"
                                                color="success"
                                              >
                                                Size
                                              </InputLabel>
                                              <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={item.size}
                                                name={item.size}
                                                color="success"
                                                onChange={(e) =>
                                                  handleInputchange(
                                                    e,
                                                    item,
                                                    "size",

                                                    index
                                                  )
                                                }
                                              >
                                                {sizeAvailable?.map(
                                                  (
                                                    item: any,
                                                    index: number
                                                  ) => {
                                                    return (
                                                      <MenuItem
                                                        key={index}
                                                        value={item?.size}
                                                      >
                                                        {item.size}
                                                      </MenuItem>
                                                    );
                                                  }
                                                )}
                                              </Select>
                                            </FormControl>
                                          </Grid>
                                          <Grid item md={4} xs={12}>
                                            <TextField
                                              value={item.totalprice}
                                              fullWidth
                                              type="number"
                                              label="Price"
                                              name={item.totalprice}
                                              variant="outlined"
                                              color="success"
                                              onChange={(e) =>
                                                handleInputchange(
                                                  e,
                                                  item,
                                                  "totalprice",

                                                  index
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid item md={4} xs={12}>
                                            <TextField
                                              value={item.totalstockavailable}
                                              fullWidth
                                              type="number"
                                              label="Total Stock"
                                              name={item.totalstockavailable}
                                              variant="outlined"
                                              color="success"
                                              onChange={(e) =>
                                                handleInputchange(
                                                  e,
                                                  item,
                                                  "totalstockavailable",
                                                  index
                                                )
                                              }
                                            />
                                          </Grid>
                                        </Grid>
                                      </form>
                                    </>
                                  );
                                })}
                              </Grid>
                            </Grid>
                          </>
                        ) : null}*/}
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

export default AddPositionModal;
