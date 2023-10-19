const api = async (method, path, body) => {
  const response = await axios({
    method,
    url: `https://financebook.niloyansellathurai.dev${path}`,
    data: body,
  });

  console.log("Hello");

  return response.data;
};
