import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const NoDataFound = () => {
  return (
    <>
      <Box sx={{mb:10}}>
        <img
          src={"/noData.gif"}
          alt=""
          style={{ height: "250px", width: "250px" }}
        />
        <Typography variant="h4">No Data Found!</Typography>
      </Box>
    </>
  );
};

export default NoDataFound;
