import { styled } from "@mui/material/styles";

export const Logo = styled((props) => {
  const { ...other } = props;

  return (
    <img
      //  src={"mainLogo.svg"}
      src={"/logo.svg"}
      alt="CQR"
      loading="lazy"
      style={{
        height: 60,
        width: 90,
      }}
    />
  );
})``;
