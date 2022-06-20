import { CacheProvider } from "@emotion/react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import "../../styles.css";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { socket, SocketContext } from "../context/socket";
import { RootState, store } from "../store";
import { theme } from "../theme";
import { setupAxios } from "../utils/axiosClient";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import "regenerator-runtime/runtime";
import { useAppSelector } from "../store/hooks";
import { getMasterAddressBalances } from "../services/generalService";
import { getNormalizedError } from "../utils/helpers";
import SplashScreen from "../components/SplashScreen/Splash";
const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const supportedChainIds = [97];

  const connectors = {
    injected: {},
  };

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const { accessToken } = store.getState().user;
  let UserSatus;

  useEffect(() => {
    setupAxios();

    if (!accessToken) {
      Router.push("/login");
    } else {
      Router.push("/");
    }
  }, []);
  const [splash, setSplash] = useState(true);
  if (splash) {
    return <SplashScreen setSplash={setSplash} />;
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
              <title>CQR - Admin Panel</title>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
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
