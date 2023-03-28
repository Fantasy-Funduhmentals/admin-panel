import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { EditorState } from "draft-js";
import {
  changesImageUrl,
  postShopData,
  updateShopData,
} from "../../services/shopService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import dynamic from "next/dynamic";
import {
  handleArticleData,
  postArticleData,
  putArticleData,
} from "../../services/newsService";
import { handleSettingsData } from "../../services/userService";
const FroalaEditorComponent = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: any;
  editData?: any;
  getShopListing?: () => void;
}

const AddPrivacyPolicyModal = (props: Props) => {
  const { open, onClose, editData, getShopListing } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl]: any = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const formik = useFormik({
    initialValues: {
      documentData: editData ? editData?.summary : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      documentData: Yup.mixed().required("Enter Your Details"),
    }),
    onSubmit: (values, actions) => {
      handlePolicyData(values, actions);
    },
  });

  const handlePolicyData = async (values, actions) => {
    try {
      setLoading(true);
      const param = {
        privacyPolicy: values?.documentData,
      };
      const res = await handleSettingsData(param);

      formik.resetForm();
      onClose();
      setLoading(false);
    } catch (error) {
      const err = getNormalizedError(error);
      setStatusData({
        type: "error",
        message: err,
      });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              background: "#232325",
              boxShadow:
                "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Privacy Policy
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#111112",
          }}
        >
          <Container maxWidth="lg">
            <Grid>
              <form onSubmit={formik.handleSubmit}>
                <Card>
                  <Grid item lg={4} md={6} xs={12}>
                    <CardHeader
                      subheader="This Text will be used as Privacy Policy."
                      title="Privacy Policy"
                    />
                  </Grid>

                  <Grid item lg={8} md={6} xs={12}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12} id="editor">
                          {editorState ? (
                            <FroalaEditorComponent
                              tag="textarea"
                              model={formik.values.documentData}
                              onModelChange={(ev: any) => {
                                if (ev)
                                  formik.setFieldValue("documentData", ev);
                              }}
                            />
                          ) : null}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      {loading ? (
                        <Button
                          color="primary"
                          variant="contained"
                          type="button"
                          fullWidth
                        >
                          <CircularProgress color="inherit" />
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          fullWidth
                        >
                          Save details
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Card>
              </form>
            </Grid>
          </Container>
        </Box>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Box>
  );
};

export default AddPrivacyPolicyModal;
