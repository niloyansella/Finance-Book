const api = async (method, path, body) => {
  const response = await axios({
    method,
    url: `http://localhost:7000${path}`,
    data: body,
  });

  return response.data;
};
