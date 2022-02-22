import React from "react";
import { Layout } from "antd";
import styles from "./Header.module.scss";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Header = ({ collapsed, toggle }) => {
  return (
    <Layout.Header className={styles.header} style={{ padding: 0 }}>
      {collapsed ? (
        <MenuUnfoldOutlined className={styles.trigger} onClick={toggle} />
      ) : (
        <MenuFoldOutlined className={styles.trigger} onClick={toggle} />
      )}
    </Layout.Header>
  );
};

export default Header;
