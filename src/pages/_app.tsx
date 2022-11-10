import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import { CacheProvider } from "@emotion/react";
import { Route } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import "regenerator-runtime/runtime";
import "../../styles.css";
import ProgressBar from "../components/ProgressBar";
import Splash from "../components/SplashScreen/Splash";
import { socket, SocketContext } from "../context/socket";
import { store } from "../store";
import { theme } from "../theme";
import { setupAxios } from "../utils/axiosClient";
import { createEmotionCache } from "../utils/create-emotion-cache";
const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const supportedChainIds = [97];

  const connectors = {
    injected: {},
  };

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const { accessToken, role } = store.getState().user;

  useEffect(() => {
    if (accessToken) {
      <Component {...pageProps} />;
      if (accessToken && Router.asPath === "/login") {
        if (role?.role == "sub admin") {
          Router.push(`/${role?.adminPermissions[0]}`);
        } else {
          Router.push("/");
        }
      }
    } else {
      Router.push("/login");
    }
    setupAxios();
  }, []);

  const [splash, setSplash] = useState(true);
  if (splash) {
    return <Splash setSplash={setSplash} />;
  }

  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>Fantasy Fundamental</title>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ProgressBar />
                {getLayout(<Component {...pageProps} />)}
              </ThemeProvider>
            </LocalizationProvider>
          </CacheProvider>
        </SocketContext.Provider>
      </Provider>
    </ThirdwebWeb3Provider>
  );
};

export default App;
