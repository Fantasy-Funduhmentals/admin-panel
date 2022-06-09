import {
  Box,
  BoxProps,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import Refresh from "./Refresh/Refresh";

interface Props extends BoxProps {
  title: string;
  subTitle: string;
  onPressAdd?: () => any;
  onChangeText?: (val: any) => any;
  handleRefresh?:()=> any;
}

export const ListToolbar = (props: Props) => {
  const { title, subTitle, onPressAdd, onChangeText,handleRefresh } = props;

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4" >
          {title}
        </Typography>
        {onPressAdd && (
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={onPressAdd} >
              Add {subTitle}
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 3 }} >
        <Card >
          <CardContent sx={{display:"flex",justifyContent:"space-between"}}>
            <Box sx={{ maxWidth: 500,minWidth:350}}>
              <TextField
                fullWidth
                onChange={onChangeText}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder={`Search ${title}`}
                variant="outlined"
              />
            </Box>
            <Box sx={{ maxWidth: 500}}>
              <Refresh style={{width:"30px",height:"30px"}} headingStyle={{fontSize:"13px"}} onClick={()=>handleRefresh()}/>
            </Box>
         
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
