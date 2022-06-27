import { Line } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import moment from "moment";
interface Props {
  walletData: {} | any;
}
const WalletPrices = (props: Props) => {
  const { walletData } = props;
  const theme = useTheme();

  const displayData = useMemo(() => {
    return walletData.map((wallet) => {
      console.log("--wallet---", wallet);

      const token = wallet?.data[0]?.token[0];
      return {
        backgroundColor: token?.coinColor,
        borderColor: token?.coinColor,
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: wallet.data?.map((wall) => wall.amount),
        label: new Date(wallet.createdAt).getFullYear(),
        maxBarThickness: 10,
        fill: false,
      };
    });
  }, []);

  console.log("---wallet data----", displayData);

  const data = {
    datasets: displayData,
    labels: [2022, 2023, 2024, 2025, 2026],
  };
  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <>
      <Card {...props}>
        <CardHeader title="All Time Price" />

        <Divider style={{ marginBottom: "30px" }} />
        <CardContent>
          <Box
            sx={{
              height: 400,
              position: "relative",
            }}
          >
            <Line data={data} options={options} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
export default WalletPrices;
