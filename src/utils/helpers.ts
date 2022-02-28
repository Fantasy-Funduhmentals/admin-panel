const getNormalizedError = (err: any) => {
  return err?.response?.data?.message || "Request Failed!";
};

export { getNormalizedError };
