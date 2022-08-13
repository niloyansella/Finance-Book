const api = async (method, path, body) => {
  const response = await axios({
    method,
    url: `https://finance-eckb.onrender.com${path}`,
    data: body,
  });

  console.log("Hello");

  return response.data;
};
