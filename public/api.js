const api = async (method, path, body) => {
  const response = await axios({
    method,
    url: `https://finance-eckb.onrender.com${path}`,
    data: body,
  });

  return response.data;
};
