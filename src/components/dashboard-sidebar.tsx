import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Lock as LockIcon } from "../icons/lock";
// import { Crypto as CryptoIcon } from "../icons/crypto";
import { Crypto as CryptoIcon } from "../icons/crypto";
import { Selector as SelectorIcon } from "../icons/selector";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { UserAdd as UserAddIcon } from "../icons/user-add";
import { Users as UsersIcon } from "../icons/users";

import { TokensIcon } from "../icons/TokensIcon";
import { NativeWallets as NativeWalletsIcon } from "../icons/NativeWallets";
import { CryptoWallets as CryptoWalletsIcon } from "../icons/CryptoWallets";

import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import { Theme } from "@mui/system";

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

  // {
  //   href: "/account",
  //   icon: <UserIcon fontSize="small" />,
  //   title: "Account",
  // },
  {
    href: "/settings",
    icon: <CogIcon fontSize="small" />,
    title: "Settings",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
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
                  CQR Admin Panel
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
