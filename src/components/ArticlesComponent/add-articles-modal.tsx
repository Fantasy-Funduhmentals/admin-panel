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
import FolderIcon from "@mui/icons-material/Folder";
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
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import {
  changesImageUrl,
  postShopData,
  updateShopData,
} from "../../services/shopService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import {
  handleArticleData,
  postArticleData,
  putArticleData,
} from "../../services/newsService";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromRaw,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { array } from "prop-types";
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

const AddArticlesModal = (props: Props) => {
  const { open, onClose, editData, getShopListing } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState("");
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const formik = useFormik({
    initialValues: {
      heading: editData ? editData?.title : "",
      twitter: editData ? editData?.socialLinks?.twitter : "",
      telegram: editData ? editData?.socialLinks?.telegram : "",
      medium: editData ? editData?.socialLinks?.medium : "",
      linkedin: editData ? editData?.socialLinks?.linkedIn : "",
      files: null,
      documentData: editData ? editData?.summary : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      heading: Yup.string().required("Enter Your heading"),
      twitter: Yup.string().required("Enter Your twitter url"),
      telegram: Yup.string().required("Enter Your telegram url"),
      medium: Yup.string().required("Enter Your medium url"),
      linkedin: Yup.string().required("Enter Your linkedin url"),
      files: Yup.mixed(),
      documentData: Yup.mixed().required("Enter Your Details"),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const uploadRes = await changesImageUrl(formData);
    return uploadRes.data.url;
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      setLoading(true);
      let params = {
        title: values?.heading,
        summary: values?.documentData,
        socialLinks: {
          telegram: values?.telegram,
          twitter: values?.twitter,
          medium: values?.medium,
          linkedIn: values?.linkedin,
        },
        mediaUrl:
          values?.files == null
            ? editData?.mediaUrl
            : await handleImageUpload(values.files[0], "NFT"),
      };

      if (editData != null) {
        // let updateParams = {
        //   ...params,
        //   id: editData._id,
        // };
        const res = await putArticleData(params, editData?._id);
        setStatusData({
          type: "success",
          message: res?.data?.message,
        });
      } else {
        const res = await postArticleData(params);
        setStatusData({
          type: "success",
          message: res?.data?.message,
        });
      }

      formik.resetForm();
      onClose();
      getShopListing();
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
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
              Articles
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
                      subheader="This image will be used as header image."
                      title="Header Image"
                    />
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Avatar
                          src={
                            editData
                              ? editData?.mediaUrl
                              : formik?.values?.files &&
                                URL?.createObjectURL(formik?.values?.files[0])
                          }
                          sx={{
                            height: 104,
                            mb: 2,
                            width: 104,
                          }}
                        >
                          {" "}
                          <FolderIcon />
                        </Avatar>
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <TextField
                        type="file"
                        onChange={(ev: any) => {
                          if (ev?.target?.files)
                            formik.setFieldValue("files", ev?.target?.files);
                        }}
                        error={Boolean(
                          formik.touched.files && formik.errors.files
                        )}
                        color="success"
                      />
                    </Box>
                  </Grid>

                  <Grid item lg={8} md={6} xs={12}>
                    <CardHeader
                      subheader="Please enter all the required information."
                      title="Articles Details"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.heading && formik.errors.heading
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.heading}
                            fullWidth
                            label="Heading"
                            name="heading"
                            helperText="Please add heading."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Box
                          // sx={{
                          //   minHeight: "300px",
                          //   maxHeight: "500px",
                          //   overflowX: "auto",
                          // }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              Article
                            </Typography>
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
                            {/* <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                            >
                              <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onEditorStateChange}
                              />
                            </Typography> */}
                          </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.twitter && formik.errors.twitter
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.twitter}
                            fullWidth
                            label="Twitter URL"
                            name="twitter"
                            helperText="Please enter the twitter url."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.telegram && formik.errors.telegram
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.telegram}
                            fullWidth
                            label="Telegram URL"
                            name="telegram"
                            helperText="Please enter the telegram url."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.medium && formik.errors.medium
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.medium}
                            fullWidth
                            label="Medium URL"
                            name="medium"
                            helperText="Please enter the medium url."
                            required
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.linkedin && formik.errors.linkedin
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.linkedin}
                            fullWidth
                            label="Linkedin URL"
                            name="linkedin"
                            helperText="Please enter the linkedin url."
                            required
                            variant="outlined"
                            color="success"
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

export default AddArticlesModal;
