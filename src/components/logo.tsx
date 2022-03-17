import { styled } from "@mui/material/styles";

export const Logo = styled((props) => {
  const { variant, ...other } = props;

  const color = variant === "light" ? "#C1C4D6" : "#5048E5";

  return (
    <img
      //  src={"mainLogo.svg"}
      src={"/mainLogo.svg"}
      alt="CQR"
      loading="lazy"
      style={{
        height: 40,
        width: 70,
      }}
    />
  );
})``;

// Logo.defaultProps = {
//   variant: "primary",
// };

// Logo.propTypes = {
//   variant: PropTypes.oneOf(["light", "primary"]),
// };
