import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { TransitionProps } from "@mui/material/transitions";
import { Box } from "@mui/system";
import { EditorState } from "draft-js";
import { useFormik } from "formik";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import { handleSettingsData } from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align",
  "direction",
  "code-block",
  "link",
  "image",
  "video",
  "background",
  "header",
  "script",
  "color",
];

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "align",
    ],
    [{ color: [] }, { background: [] }],

    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],

  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
    swcMinify: true,
  },
};

interface Props {
  open: boolean;
  onClose: any;
  editData?: any;
  getShopListing?: () => void;
}

const AddTermAndConditions = (props: Props) => {
  const { open, onClose, editData, getShopListing } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
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
      console.log("values", values);
      // handlePolicyData(values, actions);
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
              Terms and Conditions
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
                      subheader="This Text will be used as Terms and Conditions."
                      title="Terms and Conditions"
                    />
                  </Grid>

                  <Grid item lg={8} md={6} xs={12}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12} id="editor">
                          <QuillNoSSRWrapper
                            modules={modules}
                            formats={formats}
                            value={formik?.values?.documentData}
                            style={{
                              minHeight: "300px",
                            }}
                            theme="snow"
                            onChange={(e: any) => {
                              formik.setFieldValue("documentData", e);
                            }}
                          />
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

export default AddTermAndConditions;
