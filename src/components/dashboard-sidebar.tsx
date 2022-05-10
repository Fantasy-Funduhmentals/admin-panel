import { Box, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
/* @ts-ignore */
import { Theme } from "@mui/system";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Crypto as CryptoIcon } from "../icons/crypto";
import { CryptoWallets as CryptoWalletsIcon } from "../icons/cryptoWallets";
import { NativeWallets as NativeWalletsIcon } from "../icons/nativeWallets";
import { SupportIcon } from "../icons/support";
import { TokensIcon } from "../icons/tokensIcon";
import { Users as UsersIcon } from "../icons/users";
import { resetUserState } from "../store/reducers/userSlice";
import { HTTP_CLIENT } from "../utils/axiosClient";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import { useAppDispatch } from "../store/hooks";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BugReportIcon from "@mui/icons-material/BugReport";

const items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/coins",
    icon: <CryptoIcon fontSize="small" />,
    title: "Coins",
  },
  {
    href: "/tokens",
    icon: <TokensIcon fontSize="small" />,
    title: "Tokens",
  },
  {
    href: "/sdiraRequests",
    icon: <TokensIcon fontSize="small" />,
    title: "Requests",
  },
  {
    href: "/users",
    icon: <UsersIcon fontSize="small" />,
    title: "Users",
  },
  {
    href: "/crypto-wallets",
    icon: <CryptoWalletsIcon fontSize="small" />,
    title: "Crypto Wallets",
  },
  {
    href: "/native-wallets",
    icon: <NativeWalletsIcon fontSize="small" />,
    title: "Native Wallets",
  },
  {
    href: "/import-data",
    icon: <NativeWalletsIcon fontSize="small" />,
    title: "Import Data",
  },
  {
    href: "/cqr-vest",
    icon: <TokensIcon fontSize="small" />,
    title: "CQR Vest",
  },
  {
    href: "/nft-purchase-requests",
    icon: <TokensIcon fontSize="small" />,
    title: "NFT purchase requests",
  },
  {
    href: "/nft-balance",
    icon: <NativeWalletsIcon fontSize="small" />,
    title: "NFT balance",
  },
  {
    href: "/subscription",
    icon: <TokensIcon fontSize="small" />,
    title: "Subscription",
  },
  // {
  //   href: "/account",
  //   icon: <UserIcon fontSize="small" />,
  //   title: "Account",
  // },
  {
    href: "/newsletter",
    icon: <CogIcon fontSize="small" />,
    title: "Newsletter",
  },
  {
    href: "/settings",
    icon: <CogIcon fontSize="small" />,
    title: "Settings",
  },
  {
    href: "/distribute-nfts",
    icon: <BugReportIcon fontSize="small" />,
    title: "Distribute NFTS",
  },
  {
    href: "/loan-request-completed",
    icon: <TokensIcon fontSize="small" />,
    title: "Loan Request completed",
  },
  {
    href: "/chat",
    icon: <SupportIcon fontSize="small" />,
    title: "Support",
  },
  {
    href: "/report",
    icon: <CogIcon fontSize="small" />,
    title: "Reports",
  },
  {
    href: "/supply",
    icon: <Inventory2Icon fontSize="small" />,
    title: "Supply",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  }, [router.asPath]);

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/" passHref>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  />
                </a>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  CQR Admin
                </Typography>
              </Box>
            </NextLink>
          </Box>
          {/* <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  Acme Inc
                </Typography>
                <Typography color="neutral.400" variant="body2">
                  Your tier : Premium
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: "neutral.500",
                  width: 14,
                  height: 14,
                }}
              />
            </Box>
          </Box> */}
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            mb: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          {/* <Typography color="neutral.100" variant="subtitle2">
            Need more features?
          </Typography> */}
          <Typography color="neutral.500" variant="body2" textAlign="center">
            CQR Vault Admin
          </Typography>
          {/* <Box
            sx={{
              display: "flex",
              mt: 2,
              mx: "auto",
              width: "160px",
              "& img": {
                width: "100%",
              },
            }}
          >
            <img alt="Go to pro" src="/static/images/sidebar_pro.png" />
          </Box> */}
          {/* <NextLink href="https://material-kit-pro-react.devias.io/" passHref>
            <Button
              color="secondary"
              component="a"
              endIcon={<OpenInNewIcon />}
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              Pro Live Preview
            </Button>
          </NextLink> */}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
