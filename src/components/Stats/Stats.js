import React, { useEffect } from "react";
import styles from "./Stats.module.scss";
import { Row, Col } from "antd";
import address from "../../assets/images/wallet-passes-app.svg";
import key from "../../assets/images/key.svg";
import coin from "../../assets/images/coin.svg";
import { Line } from "@ant-design/charts";
import { useSelector, useDispatch } from "react-redux";
import { renderAdminPanelData } from "../../store/actions/walletActions";

const Stats = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(renderAdminPanelData());
  }, []);

  const state = useSelector((state) => state);
  useEffect(() => {
    console.log("state in Stats.js", state);
  }, [state]);

  const config = {
    data: state.wallet?.dailyChartData,
    // data:[
    //   { year: '1991', value: 3 },
    //   { year: '1992', value: 4 },
    //   { year: '1993', value: 3.5 },
    //   { year: '1994', value: 5 },
    //   { year: '1995', value: 4.9 },
    //   { year: '1996', value: 6 },
    //   { year: '1997', value: 7 },
    //   { year: '1998', value: 9 },
    //   { year: '1999', value: 13 },
    // ];

    height: 330,
    xField: "_id",
    yField: "count",
    point: {
      size: 5,
      shape: "diamond",
    },
  };

  return (
    <div className={styles.wrapper}>
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className={styles.statCard}>
            <div className={styles.icon}>
              <img src={address} alt="addresses" />
              <div className={styles.name}>No. of Wallets</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.figure}>{state.wallet.totalAddresses}</div>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className={styles.statCard}>
            <div className={styles.icon}>
              <img src={key} alt="addresses" />
              <div className={styles.name}>Admin Users</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.figure}>01</div>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className={styles.statCard}>
            <div className={styles.icon}>
              <img src={coin} alt="addresses" />
              <div className={styles.name}>No. of Coins</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.figure}>{state.wallet.coins.length}</div>
          </div>
        </Col>
      </Row>
      <div className={styles.usageChart}>
        <div className={styles.chartTitle}>
          Daily Address Created (Last 7 Days)
        </div>
        <Line {...config} />
      </div>
    </div>
  );
};

export default Stats;
