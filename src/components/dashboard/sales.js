import { Line } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StatusModal from "../StatusModal";
import { useEffect, useState } from "react";
import { getNormalizedError } from "../../utils/helpers";
import { getAllNativeWalletsData } from "../../services/tokenService";
import Slider from "../Slider/slider";
import { RotatingLines } from "react-loader-spinner";

export const Sales = (props) => {
  const [statusData, setStatusData] = useState(null);
  const [graphData, setGraphData] = useState();
  const [loading, setLoading] = useState(false);
  const getNativeWallets = async () => {
    try {
      setLoading(true);
      const walletRes = await getAllNativeWalletsData();
      setGraphData(walletRes?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getNativeWallets();
  }, []);

  const theme = useTheme();

  return (
    <Card {...props}>
      <CardHeader title="Wallets Info" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 430,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <RotatingLines
              strokeColor="#5048e5"
              strokeWidth="5"
              animationDuration="0.75"
              width="46"
              visible={true}
            />
          ) : (
            <Slider team={3}>
              {graphData?.map((item, key) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <>
                    <Box>
                      <img
                        src={item?.icon?.url}
                        alt="Coins"
                        style={{ height: "200px", width: "200px" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ fontWeight: 500, fontSize: 22 }}>
                        {item?.displayName}{" "}
                        <img
                          src={item?.displaySymbol}
                          alt=""
                          style={{ height: "20px", width: "20px" }}
                        />
                      </Box>
                      <Box
                        sx={{ fontWeight: 500, fontSize: 22, color: "gray" }}
                      >
                        <p>
                          {item?.coinSymbol == "Q"
                            ? Number(item?.price?.toLocaleString()).toFixed(2)
                            : Number(item?.price?.toLocaleString()).toFixed(3)}
                        </p>
                      </Box>
                    </Box>
                  </>
                </Box>
              ))}
            </Slider>
          )}
          {/* <Line data={DataFile} options={options} /> */}
        </Box>
      </CardContent>
      {/* <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box> */}
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Card>
  );
};
