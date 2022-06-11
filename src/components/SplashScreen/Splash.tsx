import React, { useEffect } from "react";
import styles from "./splashscreen.module.css";
import { Logo } from "../logo";
export default function Splash({ setSplash }) {
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 1000);
  });
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            {/* <Logo
              logoStyle={{ width: 140, height: 140, borderRadius: "100px" }}
              sx={{
                objectFit: "contain",
                height: 52,
                width: 52,
              }}
            /> */}
            <img src="./CQR.png" alt="" />
          </div>
          {/* <div className="pulse"></div> */}
          <div className={styles.CQRloader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
