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
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePassword } from "../../services/userService";
import StatusModal from "../StatusModal";
import { getNormalizedError } from "../../utils/helpers";
import { HTTP_CLIENT } from "../../utils/axiosClient";

export const SettingsReport = (props) => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState(null);

  const Items = [
    {
      id: 1,
      label: "Export users",
      dec: " [Generate a detailed list of user export]",
    },
    {
      id: 2,
      label: "Export Token ",
      dec: "[Generate a detailed list of Export Token]",
    },
    {
      id: 3,
      label: "Export Crypto Wallets ",
      dec: "[Generate a detailed list of Crypto Wallets]",
    },
    {
      id: 4,
      label: "Export Native Wallets ",
      dec: "[Generate a detailed list of Native Wallets]",
    },
    {
      id: 5,
      label: "Export NFTs ",
      dec: "[Generate a detailed list of Export NFTs ]",
    },
    {
      id: 6,
      label: "Export NFT Balance ",
      dec: "[Generate a detailed list of Export NFT Balance ]",
    },
  ];

  const handleSubmit = async (values, actions) => {
    debugger;
    let url;
    let name;
    setLoading(true);

    if (values.label == "Export users") {
      url = "/user/export-all-users";
      name = "users";
    } else if (values.label == "Export Token ") {
      url = "/native-token/export-all-native-tokens";
      name = "Token";
    } else if (values.label == "Export Crypto Wallets ") {
      url = "/wallet/export-all-wallets";
      name = "CryptoWallets";
    } else if (values.label == "Export Native Wallets ") {
      url = "/native-wallet/export-all-native-wallets";
      name = " NativeWallets";
    } else if (values.label == "Export NFTs ") {
      url = "/nft-token/export-all-native-wallets";
      name = "NFTsWallets";
    } else if (values.label == "Export NFT Balance ") {
      url = "/nft-wallet/export-all-nft-wallets";
      name = " NFTBalance";
    }
    console.log("name", name);
    try {
      const response = await HTTP_CLIENT.get(url, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      const fileName = name;
      fileLink.setAttribute("download", fileName);
      fileLink.setAttribute("target", "_blank");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // const handleSubmit = async (values, actions) => {
  //   try {
  //     setStatusData(null);

  //     setLoading(true);
  //     const params = {
  //       oldPassword: values.oldPassword,
  //       newPassword: values.password,
  //     };

  //     await changePassword(params);

  //     formik.resetForm();

  //     setStatusData({
  //       type: "success",
  //       message: "Password has been changed successfully",
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

  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Generate and export pre-defined reports"
          title="Report"
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
            style={{
              display: "flex",
              rowGap: "20px",
            }}
          >
            {Items?.map((item, index) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ display: "flex", columnGap: "1rem" }}>
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography sx={{ color: "gray" }}>{item.dec}</Typography>
                </Typography>
                {loading && selected == index ? (
                  <CircularProgress color="inherit" />
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setSelected(index);
                      handleSubmit(item);
                    }}
                  >
                    Download Now
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
        <Divider />
      </Card>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </form>
  );
};
