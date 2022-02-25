import { CacheProvider } from "@emotion/react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { theme } from "../theme";
import { setupAxios } from "../utils/axiosClient";
import { createEmotionCache } from "../utils/create-emotion-cache";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const { accessToken } = store.getState().user;

  useEffect(() => {
    setupAxios();

    if (!accessToken) {
      Router.push("/login");
    } else {
      Router.push("/");
    }
  }, []);

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Icovest - Admin Panel</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </LocalizationProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
