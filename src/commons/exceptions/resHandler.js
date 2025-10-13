const ClientError = require("./ClientError");

exports.resErrorHandler = (res, error) => {

  if (error instanceof ClientError) {
    const response = {
      status: false,
      message: error.message,
      error: error.errors,
    };
    return res.status(error.statusCode).json(response);
  }

  if (error?.response) {
    return res.status(error.response.status).json(error.response.data);
  }

  // Server ERROR!
  console.log(error);
  console.log(error?.message);
  const response = {
    status: false,
    message: "Internal Server Errors.",
  };
  return res.status(500).json(response);
};

exports.resSuccessHandler = (res, data, message, code = 200) => {
  const response = {
    status: true,
    data,
    message,
  };
  return res.status(code).send(response);
};
