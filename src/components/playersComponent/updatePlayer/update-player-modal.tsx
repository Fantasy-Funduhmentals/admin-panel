import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Multiselect from "multiselect-react-dropdown";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import useUpdateModal from "./useUpdateModal";
import PageItem from "../pagesData";
import StatusModal from "../../StatusModal";

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

const UpdatePlayerModal = (props: Props) => {
  const { open, onClose, editData } = props;
  console.log(
    "🚀 ~ file: add-subadmin-modal.tsx ~ line 50 ~ AddUserModal ~ editData",
    editData
  );

  const {
    onRemove,
    onSelect,
    loading,
    formik,
    statusData,
    setStatusData,
    handleDurationChange,
    selectItems,
  } = useUpdateModal(open, onClose, editData);
  const Item = [
    {
      name: "sub admin",
    },
  ];

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
              Add Sub Admim
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
          <Container maxWidth="xl">
            <Grid
              container
              spacing={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                item
                lg={8}
                md={6}
                xs={12}
                sx={{
                  // boxShadow: "#0000004a 1px 1px 18px",
                  borderRadius: "10px",
                }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Please enter all the required information create sub-admin."
                      title="Sub Admin Details"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.name && formik.errors.name
                            )}
                            fullWidth
                            helperText="Please enter the real name of the sub-admin.."
                            label="Name"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            required
                            value={formik.values.name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.email && formik.errors.email
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            fullWidth
                            label="Sub Admin Email"
                            name="email"
                            helperText="Please enter sub-admin email address"
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.password && formik.errors.password
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            fullWidth
                            label="Password"
                            name="password"
                            helperText="Please enter the password for this email."
                            required
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth>
                            <Multiselect
                              showArrow={true}
                              keepSearchTerm={true}
                              avoidHighlightFirstOption={true}
                              hidePlaceholder={true}
                              style={{
                                chips: {
                                  background: "#5048E5",
                                },
                                searchBox: {
                                  border: "1px solid rgb(230 232 240)",
                                  fontSize: "10px",
                                  minHeight: "55px",
                                },
                                inputField: {
                                  color: "black",
                                },
                              }}
                              placeholder="Please select permission"
                              showCheckbox={true}
                              options={PageItem}
                              onSelect={onSelect}
                              onRemove={onRemove}
                              displayValue="name"
                            />
                          </FormControl>
                          <Grid />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Select Role
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={selectItems}
                              label="Select Role"
                              onChange={handleDurationChange}
                            >
                              {Item.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Grid />
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
                          "Save Sub Admin"
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
    </Box>
  );
};

export default UpdatePlayerModal;
