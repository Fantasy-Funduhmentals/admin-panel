import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NewsletterListResults } from "../components/newsletter/newsletter-list-results";
import StatusModal from "../components/StatusModal";
import { HTTP_CLIENT } from "../utils/axiosClient";
import {
  exportAllNewsletter,
  handleNewsletterData,
} from "../services/newsService";
import { getNormalizedError } from "../utils/helpers";

const NewsLetter = () => {
  const [loading, setLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState();
  const [downloadLink, setDownloadLink] = useState(null);
  const [count, setCount] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getNewsletterListing = async () => {
    setLoading(true);
    try {
      const res = await handleNewsletterData();
      setData(res?.data);
      // setCount(res?.data?.total);
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

  const handleClickDownload = () => {
    const link = document.createElement("a");
    link.href = "/path/to/file.pdf";
    link.download = "file.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewsletter = async () => {
    try {
      setNewsletterLoading(true);
      const response = await HTTP_CLIENT.get(
        "/newsletter/export-all-newsletter",
        {
          responseType: "blob",
        }
      );
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "file.xlsx");
      fileLink.setAttribute("target", "_blank");
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
      setNewsletterLoading(false);
    } catch (err) {
      setNewsletterLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getNewsletterListing();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>News</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ListToolbar
            title="Newsletter Management"
            subTitle="Newsletter"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getNewsletterListing}
          />
          <Box
            sx={{
              background: "#232325",
              boxSizing: "border-box",
              margin: "1rem 0rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem ",
              borderRadius: "8px",
            }}
          >
            <Typography sx={{ m: 1 }} variant="h6">
              Download Newsletters
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Button
                color="success"
                variant="contained"
                onClick={() => !newsletterLoading && handleNewsletter()}
              >
                {newsletterLoading
                  ? // <CircularProgress
                    //   color="inherit"
                    //   style={{ height: "25px", width: "25px" }}
                    // />
                    "Loading..."
                  : "Download"}
              </Button>
              {downloadLink && (
                <a href={downloadLink} download>
                  Download
                </a>
              )}
            </Box>
          </Box>
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <NewsletterListResults
                data={data}
                searchQuery={searchText}
                count={count}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                page={page}
                limit={limit}
              />
            )}
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
NewsLetter.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsLetter;
