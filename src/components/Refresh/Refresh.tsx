import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import styles from "./refresh.module.css";

interface Props {
  style: any;
  headingStyle: any;
  onClick: (val?: any) => any;
}
const Refresh = (props: Props) => {
  const { style, headingStyle, onClick } = props;
  const [active, setActive] = useState(false);
  const handleClick = async () => {
    setActive(true);
    await onClick();
    setActive(false);
  };
  return (
    <>
      <Box sx={{ textAlign: "center", cursor: "pointer" }}>
        <img
          src={"/Refresh.svg"}
          alt=""
          style={style}
          onClick={() => handleClick()}
          className={
            active
              ? styles.rotateRefrechComponent
              : styles.notRotateRefrechComponent
          }
        />
        <Typography style={headingStyle}>Refresh</Typography>
      </Box>
    </>
  );
};

export default Refresh;
