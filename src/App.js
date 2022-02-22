import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import { Layout } from "antd";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import logoIcon from "./assets/images/logo-icon.png";
import logo from "./assets/images/logo.png";
import CoinManagement from "./components/CoinManagement/CoinManagement";
import DepositAddresses from "./components/DepositAddresses/DepositAddresses";
import Login from "./components/Login/Login";
import MerchantManagment from "./components/MerchantManagment/MerchantManagment";
import NewToken from "./components/NewToken/NewToken";
import AddUser from "./components/NewUser";
import ProductManagment from "./components/productManagment/productManagment";
import Settings from "./components/Settings/Settings";
import ShopManagment from "./components/shopManagment/shopManagment";
import Stats from "./components/Stats/Stats";
import UserManagement from "./components/UserManagement";
import Header from "./components/_common/Header/Header";
import Navigation from "./components/_common/Navigation/Navigation";
import PrivateRoute from "./components/_common/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/_common/PublicRoute/PublicRoute";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isVerifying = useSelector((state) => state.auth.isVerifying);

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Router>
        <Switch>
          <PublicRoute
            exact
            path="/"
            component={Login}
            isAuthenticated={isAuthenticated}
            isVerifying={isVerifying}
          />
          <>
            <Layout
              style={{
                minHeight: "100vh",
              }}
            >
              <Layout.Sider
                style={{ minHeight: "100vh" }}
                trigger={null}
                collapsible
                collapsed={collapsed}
              >
                <div className="sidebarLogo">
                  <div
                    style={{
                      marginRight: collapsed ? "0px" : "10px",
                    }}
                  >
                    {collapsed ? (
                      <img
                        style={{ width: "100%" }}
                        src={logoIcon}
                        alt="logo"
                      />
                    ) : (
                      <img style={{ width: "100%" }} src={logo} alt="logo" />
                    )}
                  </div>
                  {/* <div
                    style={{
                      display: "block",
                      fontWeight: "500",
                      fontSize: "16px",
                      whiteSpace: "nowrap",
                      opacity: collapsed ? "0" : "1",
                      overflow: "hidden",
                    }}
                  >
                    CryptoKara
                  </div> */}
                </div>
                <Navigation />
              </Layout.Sider>
              <Layout className="siteLayout">
                <Header collapsed={collapsed} toggle={toggle} />
                <Layout.Content
                  className="siteLayoutBackground"
                  style={{
                    margin: "24px 16px 16px 16px",
                    padding: 24,
                    minHeight: 280,
                  }}
                >
                  <PrivateRoute
                    exact
                    path="/dashboard"
                    component={Stats}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  <PrivateRoute
                    exact
                    path="/coin-management"
                    component={CoinManagement}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  {/* <PrivateRoute
                    exact
                    path="/transactions"
                    component={Transactions}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  /> */}

                  <PrivateRoute
                    exact
                    path="/merchant-management"
                    component={MerchantManagment}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  <PrivateRoute
                    exact
                    path="/shop-management"
                    component={ShopManagment}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  <PrivateRoute
                    exact
                    path="/product-management"
                    component={ProductManagment}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  <PrivateRoute
                    exact
                    path="/add-new-token"
                    component={NewToken}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />

                  <PrivateRoute
                    exact
                    path="/deposit-addresses"
                    component={DepositAddresses}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  {/* <PrivateRoute
                    exact
                    path="/news-management"
                    component={NewsManagement}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/add-news"
                    component={AddNews}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/add-news/:id"
                    component={AddNews}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  /> */}
                  {/* <PrivateRoute
                    exact
                    path="/DApps-management"
                    component={DAppManagement}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/add-DApp"
                    component={AddDApp}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/add-DApp/:id"
                    component={AddDApp}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  /> */}
                  <PrivateRoute
                    exact
                    path="/user-management"
                    component={UserManagement}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/add-user"
                    component={AddUser}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                  <PrivateRoute
                    exact
                    path="/settings"
                    component={Settings}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                  />
                </Layout.Content>
              </Layout>
            </Layout>
          </>
        </Switch>
      </Router>
    </>
  );
};

export default App;
