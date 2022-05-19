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

export const Sales = (props) => {
  const [statusData, setStatusData] = useState(null);
  const [graphData, setGraphData] = useState();
  const [loading , setLoading] = useState(false)
  const getNativeWallets = async () => {
    try {
      setLoading(true)
      const walletRes = await getAllNativeWalletsData();
      setGraphData(walletRes?.data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
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
  // const DataFile = {
  //   datasets: [
  //     {
  //       backgroundColor: "rgba(75,192,192,0.2)",
  //       borderColor: "rgba(75,192,192,1)",

  //       barPercentage: 0.5,
  //       barThickness: 12,
  //       borderRadius: 4,
  //       categoryPercentage: 0.5,
  //       data: [18, 5, 19, 27, 29, 19, 20],
  //       label: "Last year",
  //       maxBarThickness: 10,
  //       fill: true,
  //     },
  //     {
  //       backgroundColor: "#EEEEEE",
  //       borderColor: "#742774",
  //       barPercentage: 0.5,
  //       barThickness: 12,
  //       borderRadius: 4,
  //       categoryPercentage: 0.5,
  //       data: [11, 20, 12, 29, 30, 25, 13],
  //       label: "Last year",
  //       maxBarThickness: 10,
  //     },
  //   ],
  //   labels: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 aug"],
  // };

  // const options = {
  //   animation: false,
  //   cornerRadius: 20,
  //   layout: { padding: 0 },
  //   legend: { display: false },
  //   maintainAspectRatio: false,
  //   responsive: true,
  //   xAxes: [
  //     {
  //       ticks: {
  //         fontColor: theme.palette.text.secondary,
  //       },
  //       gridLines: {
  //         display: false,
  //         drawBorder: false,
  //       },
  //     },
  //   ],
  //   yAxes: [
  //     {
  //       ticks: {
  //         fontColor: theme.palette.text.secondary,
  //         beginAtZero: true,
  //         min: 0,
  //       },
  //       gridLines: {
  //         borderDash: [2],
  //         borderDashOffset: [2],
  //         color: theme.palette.divider,
  //         drawBorder: false,
  //         zeroLineBorderDash: [2],
  //         zeroLineBorderDashOffset: [2],
  //         zeroLineColor: theme.palette.divider,
  //       },
  //     },
  //   ],
  //   tooltips: {
  //     backgroundColor: theme.palette.background.paper,
  //     bodyFontColor: theme.palette.text.secondary,
  //     borderColor: theme.palette.divider,
  //     borderWidth: 1,
  //     enabled: true,
  //     footerFontColor: theme.palette.text.secondary,
  //     intersect: false,
  //     mode: "index",
  //     titleFontColor: theme.palette.text.primary,
  //   },
  // };

  return (
    <Card {...props}>
      <CardHeader
        action={
          <Button endIcon={<ArrowDropDownIcon fontSize="small" />} size="small">
            Last 7 days
          </Button>
        }
        title="Wallets Info"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 430,
            position: "relative",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          {loading ? (
            <CircularProgress />
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
                        <p>{item?.price}</p>
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
