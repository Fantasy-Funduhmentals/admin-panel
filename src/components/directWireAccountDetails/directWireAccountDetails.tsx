import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { directWireAccountDetails } from "../../services/userService";
import { RootState } from "../../store";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import { getSwapRate } from "../../services/userService";
import { saveSettings } from "../../store/reducers/settingsSlice";
import { useAppDispatch } from "../../store/hooks";

const WireAccountDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const dispatch = useAppDispatch();
  const getSettings = async () => {
    const response = await getSwapRate();
    dispatch(saveSettings(response?.data));
    setBankDetails(response?.data?.directWireAccount);
  };

  const formik = useFormik({
    initialValues: {
      fullname: bankDetails?.name ? bankDetails.name : "",
      email: bankDetails?.email ? bankDetails.email : "",
      physicaladdress: bankDetails?.address ? bankDetails?.address : "",
      bankname: bankDetails?.bankName ? bankDetails?.bankName : "",
      bankaddress: bankDetails?.bankAddress ? bankDetails?.bankAddress : "",
      accountnumber: bankDetails?.accountNo ? bankDetails?.accountNo : "",
      accounttype: bankDetails?.accounttype ? bankDetails?.accounttype : "",
      bankrouting: bankDetails?.routingNo ? bankDetails?.routingNo : "",
      wireTransfers: bankDetails?.wireTransfers
        ? bankDetails?.wireTransfers
        : "",
      endorsement: bankDetails?.endorsement ? bankDetails?.endorsement : "",
      zellePay: bankDetails?.zellePay ? bankDetails?.zellePay : "",
      swiftCode: bankDetails?.swiftCode ? bankDetails?.swiftCode : "",
      swiftAddress: bankDetails?.swiftAddress ? bankDetails?.swiftAddress : "",
      internationalSwiftCode: bankDetails?.internationalSwiftCode
        ? bankDetails?.internationalSwiftCode
        : "",
      internationalSwiftAddress: bankDetails?.internationalSwiftAddress
        ? bankDetails?.internationalSwiftAddress
        : "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required().min(1).max(33).label("fullname"),
      email: Yup.string()
        .email("Field should contain a valid e-mail")
        .required()
        .min(1)
        .max(33)
        .label("email"),
      physicaladdress: Yup.string()
        .required()
        .min(1)
        .max(100)
        .label("physicaladdress"),
      bankname: Yup.string().required().min(1).max(203).label("bankname"),
      wireTransfers: Yup.string()
        .required()
        .min(1)
        .max(203)
        .label("wireTransfers"),
      endorsement: Yup.string().required().min(1).max(200).label("endorsement"),
      zellePay: Yup.string().required().min(1).max(203).label("zellePay"),
      bankaddress: Yup.string().required().min(1).max(200).label("bankaddress"),
      accountnumber: Yup.string()
        .required()
        .min(1)
        .max(33)
        .label("accountnumber"),
      accounttype: Yup.string()
        .required()
        .min(1)
        .max(100)
        .label("accountnumber"),
      swiftCode: Yup.string().required().min(1).max(100).label("swiftCode"),
      swiftAddress: Yup.string()
        .required()
        .min(1)
        .max(100)
        .label("swiftAddress"),
      internationalSwiftCode: Yup.string()
        .required()
        .min(1)
        .max(100)
        .label("internationalSwiftCode"),
      internationalSwiftAddress: Yup.string()
        .required()
        .min(1)
        .max(100)
        .label("internationalSwiftAddress"),
      bankrouting: Yup.string().required().min(1).max(100).label("bankrouting"),
    }),
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);

      setLoading(true);
      const params = {
        name: values.fullname,
        email: values?.email,
        address: values.physicaladdress,
        bankName: values.bankname,
        bankAddress: values.bankaddress,
        accountNo: String(values.accountnumber),
        accounttype: values.accounttype,
        routingNo: String(values.bankrouting),
        wireTransfers: values.wireTransfers,
        endorsement: values.endorsement,
        zellePay: values.zellePay,
        swiftCode: String(values.swiftCode),
        swiftAddress: String(values.swiftAddress),
        internationalSwiftCode: String(values.internationalSwiftCode),
        internationalSwiftAddress: String(values.internationalSwiftAddress),
      };
      await directWireAccountDetails(params);
      formik.resetForm();
      setStatusData({
        type: "success",
        message: "Account details has been submitted successfully",
      });
      getSettings();

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

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit} {...props}>
        <Card>
          <CardHeader title="Direct Wire Account Details" />
          <Divider />
          <CardContent>
            <TextField
              error={Boolean(formik.touched.bankname && formik.errors.bankname)}
              value={formik.values.bankname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Receiving Bank"
              margin="normal"
              name="bankname"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.bankaddress && formik.errors.bankaddress
              )}
              value={formik.values.bankaddress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Address"
              margin="normal"
              name="bankaddress"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.fullname && formik.errors.fullname)}
              value={formik.values.fullname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Account Name"
              margin="normal"
              name="fullname"
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(
                formik.touched.physicaladdress && formik.errors.physicaladdress
              )}
              value={formik.values.physicaladdress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Account Holder
              Mailing Address"
              margin="normal"
              name="physicaladdress"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.zellePay && formik.errors.zellePay)}
              value={formik.values.zellePay}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Zelle Remittance"
              margin="normal"
              name="zellePay"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.accountnumber && formik.errors.accountnumber
              )}
              value={formik.values.accountnumber}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Account Number "
              margin="normal"
              name="accountnumber"
              type="string"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.bankrouting && formik.errors.bankrouting
              )}
              value={formik.values.bankrouting}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="ABA Routing No. 
              Electronic"
              margin="normal"
              name="bankrouting"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.wireTransfers && formik.errors.wireTransfers
              )}
              value={formik.values.wireTransfers}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Wire Transfers"
              margin="normal"
              name="wireTransfers"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.endorsement && formik.errors.endorsement
              )}
              value={formik.values.endorsement}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Endorsement"
              margin="normal"
              name="endorsement"
              type="text"
              variant="outlined"
            />

            {/* <TextField
              error={Boolean(
                formik.touched.accounttype && formik.errors.accounttype
              )}
              value={formik.values.accounttype}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Account type (e.g., checking, savings, etc.)"
              margin="normal"
              name="accounttype"
              type="text"
              variant="outlined"
            /> */}
            <Box sx={{ fontWeight: "bold", pt: 3, pb: 3 }}>International</Box>
            <TextField
              error={Boolean(
                formik.touched.swiftCode && formik.errors.swiftCode
              )}
              value={formik.values.swiftCode}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="SWIFT Code"
              margin="normal"
              name="swiftCode"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.swiftAddress && formik.errors.swiftAddress
              )}
              value={formik.values.swiftAddress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="SWIFT Address"
              margin="normal"
              name="swiftAddress"
              type="text"
              variant="outlined"
            />
            <Box sx={{ fontWeight: "bold", pt: 3, pb: 3 }}>Local</Box>
            <TextField
              error={Boolean(
                formik.touched.internationalSwiftCode &&
                  formik.errors.internationalSwiftCode
              )}
              value={formik.values.internationalSwiftCode}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="SWIFT Code"
              margin="normal"
              name="internationalSwiftCode"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.internationalSwiftAddress &&
                  formik.errors.internationalSwiftAddress
              )}
              value={formik.values.internationalSwiftAddress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="SWIFT Address"
              margin="normal"
              name="internationalSwiftAddress"
              type="text"
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
            {" "}
            {!loading ? (
              <Button color="primary" variant="contained" type="submit">
                Update
              </Button>
            ) : (
              <CircularProgress disableShrink />
            )}
          </Box>
        </Card>
      </form>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

export default WireAccountDetails;
