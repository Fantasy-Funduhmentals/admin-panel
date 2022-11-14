import { styled } from "@mui/material/styles";

export const Logo = styled((props) => {
  const { ...other } = props;

  return (
    <img
      src={"/logo.svg"}
      alt=""
      loading="lazy"
      style={{
        height: 60,
        width: 90,
      }}
    />
  );
})``;
