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

interface Props extends BoxProps {
  title: string;
  subTitle: string;
  onPressAdd?: () => any;
  onChangeText?: (val: any) => any;
}

export const ListToolbar = (props: Props) => {
  const { title, subTitle, onPressAdd, onChangeText } = props;

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
        <Typography sx={{ m: 1 }} variant="h4">
          {title}
        </Typography>
        {onPressAdd && (
          <Box sx={{ m: 1 }}>
            <Button color="primary" variant="contained" onClick={onPressAdd}>
              Add {subTitle}
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
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
                placeholder={`Search ${subTitle}`}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
