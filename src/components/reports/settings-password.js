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

  const Items = [
    {
      id: 1,
      label: "Export users",
    },
    {
      id: 2,
      label: "Export Token",
    },
    {
      id: 3,
      label: "Export Crypto Wallets",
    },
    {
      id: 4,
      label: "Export Native Wallets",
    },
    {
      id: 5,
      label: "Export NFTs",
    },
    {
      id: 6,
      label: "Export NFT Balance",
    },
  ];

  const handleSubmit = async (values, actions) => {
    debugger;
    let url;
    let name;
    setLoading(true);
    console.log("values****", values);

    if (values.label == "Export users") {
      url = "/user/export-all-users";
      // name = "users.xlsx";
    } else if (values.label == "Export Token") {
      url = "/native-token/export-all-native-tokens";
      // name = "Token.xlsx";
    } else if (values.label == "Export Crypto Wallets") {
      url = "/wallet/export-all-wallets";
      // name = "CryptoWallets.xlsx";
    } else if (values.label == "Export Native Wallets") {
      url = "/native-wallet/export-all-native-wallets";
      // name = " nativeWallets.xlsx";
    } else if (values.label == "Export NFTs") {
      url = "/nft-token/export-all-native-wallets";
      // name = "NFTsWallets.xlsx";
    } else if (values.label == "Export NFT Balance") {
      url = "/nft-wallet/export-all-nft-wallets";
      // name = " NFTBalance.xlsx";
    }

    // switch (values) {
    //   case values.label == "Export users":
    //     url = "/user/export-all-users";
    //     name = "users.xlsx";
    //     break;

    //   case values.label == "Export Token":
    //     url = "/native-token/export-all-native-tokens";
    //     name = "Token.xlsx";
    //     break;

    //   case values.label == "Export Crypto Wallets":
    //     url = "/wallet/export-all-wallets";
    //     name = "CryptoWallets.xlsx";
    //     break;

    //   case values.label == "Export NFTs":
    //     url = "/nft-token/export-all-native-wallets";
    //     name = "NFTsWallets.xlsx";
    //     break;

    //   case values.label == "Export NFT Balance":
    //     url = "/nft-wallet/export-all-nft-wallets";
    //     name = " NFTBalance.xlsx";
    //     break;

    //   default:
    //     break;
    // }

    try {
      const response = await HTTP_CLIENT.get(url, {
        responseType: "blob",
      });

      console.log("response>>", response);
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      const fileName = "report.xlsx";
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
        <CardHeader subheader="Download Report" title="Report" />
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
                <Typography variant="h6">{item.label}</Typography>
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
