import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePassword } from "../../services/userService";
import StatusModal from "../StatusModal";
import { getNormalizedError } from "../../utils/helpers";

export const SettingsPassword = (props) => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required()
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("Password")
        .trim(),
      password: Yup.string()
        .required()
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("Password")
        .trim(),
      confirm: Yup.string()
        .required()
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
    <form {...props}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <TextField
            error={Boolean(
              formik.touched.oldPassword && formik.errors.oldPassword
            )}
            value={formik.values.oldPassword}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            fullWidth
            label="Old Password"
            margin="normal"
            name="oldPassword"
            type="password"
            variant="outlined"
          />

          <TextField
            error={Boolean(formik.touched.password && formik.errors.password)}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            type="password"
            variant="outlined"
          />
          <TextField
            error={Boolean(formik.touched.confirm && formik.errors.confirm)}
            value={formik.values.confirm}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            fullWidth
            label="Confirm Password"
            margin="normal"
            name="confirm"
            type="password"
            variant="outlined"
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
  );
};