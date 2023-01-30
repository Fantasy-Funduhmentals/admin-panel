import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { changePassword } from "../../services/userService";
import { useAppDispatch } from "../../store/hooks";
import { resetAdminState } from "../../store/reducers/adminSlice";
import { resetCoinState } from "../../store/reducers/coinSlice";
import { resetEmailState } from "../../store/reducers/emailSlice";
import { resetSettingsState } from "../../store/reducers/settingsSlice";
import { resetUserState } from "../../store/reducers/userSlice";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import { useRouter } from "next/router";

export const SettingsPassword = (props) => {
  const location = useRouter();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oldPasswordtoogle, setOldpasswordToogle] = useState(false);
  const [passwordToogle, setPasswordtoogle] = useState(false);
  const [confirmPasswordtoogle, setConfirmpasswordToogle] = useState(false);

  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Enter the old password")
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("oldPassword")
        .trim(),
      password: Yup.string()
        .required("Enter new password")
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("password")
        .trim(),
      confirm: Yup.string()
        .required("Enter confirm password")
        .oneOf([Yup.ref("password"), null], "Password do not match")
        .min(8)
        .max(33)
        .label("Confirm Password")
        .trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleLogout = () => {
    dispatch(resetUserState());
    dispatch(resetAdminState());
    dispatch(resetCoinState());
    dispatch(resetSettingsState());
    dispatch(resetEmailState());
    location.push("/");
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      setLoading(true);
      const params = {
        oldPassword: values.oldPassword,
        newPassword: values.password,
      };
      await changePassword(params);
      formik.resetForm();
      setStatusData({
        type: "success",
        message: "Password has been changed successfully",
      });

      setLoading(false);
      handleLogout();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  const handleShowpassword = (fieldName) => {
    if (fieldName === "oldPassword") setOldpasswordToogle(!oldPasswordtoogle);
    else if (fieldName === "password") setPasswordtoogle(!passwordToogle);
    else setConfirmpasswordToogle(!confirmPasswordtoogle);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        {...props}
        style={{
          display: "flex",
          width: "100%",
          columnGap: "1rem",
          rowGap: "1rem",
          paddingBottom: "2rem",
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardHeader subheader="Update password" title="Password" />
          <Divider />
          <CardContent>
            <TextField
              error={Boolean(
                formik.touched.oldPassword && formik.errors.oldPassword
              )}
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
              value={formik.values.oldPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Old Password"
              margin="normal"
              name="oldPassword"
              type={oldPasswordtoogle ? "text" : "password"}
              color="success"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleShowpassword("oldPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {oldPasswordtoogle ? (
                        <Visibility />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Password"
              margin="normal"
              name="password"
              type={passwordToogle ? "text" : "password"}
              color="success"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleShowpassword("password")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {passwordToogle ? <Visibility /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              error={Boolean(formik.touched.confirm && formik.errors.confirm)}
              helperText={formik.touched.confirm && formik.errors.confirm}
              value={formik.values.confirm}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Confirm Password"
              margin="normal"
              name="confirm"
              type={confirmPasswordtoogle ? "text" : "password"}
              color="success"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleShowpassword("confirm")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {confirmPasswordtoogle ? (
                        <Visibility />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained" type="submit">
              {loading ? <CircularProgress /> : "Update"}
            </Button>
          </Box>
        </Card>

        <StatusModal
          statusData={statusData}
          onClose={() => setStatusData(null)}
        />
      </form>
    </>
  );
};
