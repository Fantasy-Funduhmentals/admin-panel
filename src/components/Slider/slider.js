import { Button } from "@mui/material";
import Carousel, { consts } from "react-elastic-carousel";
// import BackButton from "../../../Assets/icons/Back_White.svg";
// import NextButton from "../../../Assets/icons/Next_White.svg";

function Slider({ children, team }) {
  const breakpoints1 = [
    { width: 0, itemsToShow: 1, itemsToScroll: 1 },
    { width: 600, itemsToShow: 2, itemsToScroll: 1 },
    { width: 1024, itemsToShow: 3, itemsToScroll: 1 },
  ];
  const breakpoints2 = [
    { width: 600, itemsToShow: 1, itemsToScroll: 1 },
    { width: 1024, itemsToShow: 1, itemsToScroll: 1 },
    { width: 1400, itemsToShow: 1, itemsToScroll: 1 },
  ];
  const breakpoints3 = [
    { width: 0, itemsToShow: 1, itemsToScroll: 1 },
    { width: 600, itemsToShow: 2, itemsToScroll: 1 },
    { width: 1024, itemsToShow: 3, itemsToScroll: 1 },
  ];
  const brackpointsList = {
    1: breakpoints1,
    2: breakpoints2,
    3: breakpoints3,
  };
  const myArrow = ({ type, onClick, isEdge }) => {
    const pointer =
      type === consts.PREV ? (
        <Button
          variant="contained"
          sx={{
            background: "#5048E5",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "50px 0px 0px 50px",
          }}
        >
          back
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{
            background: "#5048E5",
            color: "#fff",
            borderRadius: "0px 50px 50px 0px",
          }}
        >
          next
        </Button>
      );
    return (
      <button
        style={{ background: "transparent", border: "none" }}
        onClick={onClick}
      >
        {pointer}
      </button>
    );
  };

  return (
    <>
      <Carousel
        breakPoints={brackpointsList[team]}
        // className={Styles.innerWrapper}
        autoPlaySpeed={5000}
        enableAutoPlay
        renderArrow={myArrow}
        enableSwipe
      >
        {children}
      </Carousel>
    </>
  );
}

export default Slider;
