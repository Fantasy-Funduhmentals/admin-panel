import {
  AuditOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu, Popconfirm } from "antd";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { userLogout } from "../../../store/actions/authActions";

const Navigation = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const dispatch = useDispatch();

  const renderLocation = () => {
    // console.log("--location---", location);

    switch (location.pathname) {
      case "/dashboard":
        return ["1"];
      case "/coin-management":
        return ["2"];
      case "/deposit-addresses":
        return ["3"];
      // case "/transactions":
      //   return ["4"];
      case "/merchant-management":
        return ["5"];
      case "/shop-management":
        return ["6"];
      case "/settings":
        return ["7"];
      default:
        return ["1"];
    }
  };

  useEffect(() => {
    let userData;
    userData = ("userToken", jwt_decode(localStorage.getItem("accessToken")));
    setUserRole(userData?.user?.role);
  }, []);

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={renderLocation()}>
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<ToolOutlined />}>
        <Link to={`/coin-management`}>Coin Management</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<DollarCircleOutlined />}>
        <Link to="/deposit-addresses">Deposit Addresses</Link>
      </Menu.Item>
      {/* <Menu.Item key="4" icon={<DollarCircleOutlined />}>
        <Link to="/transactions">Transactions</Link>
      </Menu.Item> */}

      <Menu.Item key="5" icon={<AuditOutlined />}>
        <Link to="/merchant-management">Merchants</Link>
      </Menu.Item>
      <Menu.Item key="6" icon={<ShopOutlined />}>
        <Link to="/shop-management">Shops</Link>
      </Menu.Item>
      {/* <Menu.Item key="7" icon={<AppstoreAddOutlined />}>
        <Link to="/product-management">Products</Link>
      </Menu.Item> */}
      {/* <Menu.Item key="5" icon={<AppstoreAddOutlined />}>
        <Link to="/DApps-management">DApp</Link>
      </Menu.Item> */}
      {userRole && userRole === "admin" && (
        <Menu.Item key="8" icon={<UsergroupAddOutlined />}>
          <Link to="/user-management">User Management</Link>
        </Menu.Item>
      )}
      <Menu.Item key="9" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="8" icon={<LogoutOutlined />}>
        <Popconfirm
          title="Are you sure you want to logout?"
          onConfirm={() => dispatch(userLogout())}
          onCancel={() => console.log("--cancelled--")}
          okText="Yes"
          cancelText="No"
        >
          Logout
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;
