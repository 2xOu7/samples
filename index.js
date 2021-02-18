const express = require("express");
const axios = require("axios").default;

const app = express();
const port = process.env.PORT || 3000;

const config = {
  headers: {
    "X-MarkovAPIKey": "6fbf43c1-b485-4aab-a91e-1c980f5a20a0",
  },
};

const featureId = "ewfjfijoe";

const token = "Bearer bearer";

const forwardRequestBodyToken = async (req) => {
  const { headers, protocol, originalUrl, method } = req;

  if (headers["frommarkov"]) {
    return;
  }

  const url = protocol + "://" + req.get("host") + originalUrl;

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: {
      auth: {
        auth: token,
      },
    },
    headers: headersToSend,
    requestHasToken: {
      through: "BODY",
      location: {
        auth: {
          auth: true,
        },
      },
    },
    featureId: featureId,
  };

  const response = await axios.post(
    "http://localhost:8000/input/request",
    payloadToSend,
    config
  );

  return response.status;
};

const forwardRequestHeaderToken = async (req) => {
  const { headers, protocol, originalUrl, method, body } = req;

  if (headers["frommarkov"]) {
    return;
  }

  const url = protocol + "://" + req.get("host") + originalUrl;

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: body ? body : null,
    headers: headersToSend,
    requestHasToken: {
      through: "HEADER",
      location: {
        authorization: true,
      },
    },
    featureId: featureId,
  };

  try {
    const response = await axios.post(
      "http://localhost:8000/input/request",
      payloadToSend,
      config
    );

    return response.status;
  } catch (err) {
    return err.response;
  }
};

const forwardWrongRequestHeaderToken = async (req) => {
  let { headers, protocol, originalUrl, method, body } = req;
  req.headers["authorization"] = token;

  let config = {
    headers: {
      "X-MarkovAPIKey": "markovKey",
    },
  };

  if (headers["frommarkov"]) {
    return;
  }

  const url = protocol + "://" + req.get("host") + originalUrl;

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: body ? body : null,
    headers: headersToSend,
    requestHasToken: {
      through: "HEADER",
      location: {
        fakeauthorization: true,
      },
    },
    featureId: featureId,
  };

  try {
    var response = await axios.post(
      "http://localhost:8000/input/request",
      payloadToSend,
      config
    );

    return response.status;
  } catch (error) {
    return error.response;
  }
};

const forwardWrongRequestBodyToken = async (req) => {
  const { headers, protocol, originalUrl, method, body } = req;
  req.headers["authorization"] = token;

  if (headers["frommarkov"]) {
    return;
  }

  const url = protocol + "://" + req.get("host") + originalUrl;

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: {
      authorization: token,
    },
    headers: headersToSend,
    requestHasToken: {
      through: "BODY",
      location: {
        authorization: {
          authorization: true,
        },
      },
      featureId: featureId,
    },
  };

  try {
    const response = await axios.post(
      "http://localhost:8000/input/request",
      payloadToSend,
      config
    );

    return response.status;
  } catch (error) {
    return error.response;
  }
};

const forwardRequestQueryParamToken = async (req) => {
  const { headers, protocol, originalUrl, method, body } = req;
  req.headers["authorization"] = token;

  if (headers["frommarkov"]) {
    return;
  }

  const url =
    protocol + "://" + req.get("host") + originalUrl + "?name=ferret&token=435";

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: body ? body : null,
    headers: headersToSend,
    requestHasToken: {
      through: "QUERYPARAM",
      location: {
        token: true,
      },
      featureId: featureId,
    },
  };

  try {
    const response = await axios.post(
      "http://localhost:8000/input/request",
      payloadToSend,
      config
    );

    return response.status;
  } catch (error) {
    return error.response;
  }
};

const forwardSignInRequest = async (req) => {
  const { headers, protocol, originalUrl, method, body } = req;

  if (headers["frommarkov"]) {
    return;
  }

  const url = protocol + "://" + req.get("host") + originalUrl;

  const headersToSend = [];
  for (header in headers) {
    headersToSend.push({ headerName: header, headerValue: headers[header] });
  }

  const payloadToSend = {
    method,
    url,
    body: body ? body : null,
    headers: headersToSend,
    responseHasToken: {
      through: "BODY",
      location: {
        token: true,
      },
    },
    tokenValue: req.params.id,
  };

  try {
    const response = await axios.post(
      "http://localhost:8000/input/request",
      payloadToSend,
      config
    );

    return response.status;
  } catch (error) {
    return error.response;
  }
};

// app.disable("etag");

app.get("/signin/:id", async (req, res) => {
  console.log("Sign in called");
  await forwardSignInRequest(req);
  res.status(200).json({ token: req.params.id });
});

app.get("/routeA", async function (req, res) {
  console.log(`routeA called from user ${req.headers["authorization"]}`);
  await forwardRequestHeaderToken(req);
  res.status(200).json("Success");
});

app.get("/routeB", async function (req, res) {
  console.log(`routeB called from user ${req.headers["authorization"]}`);
  await forwardRequestHeaderToken(req);
  res.status(200).json("Success");
});

app.get("/routeC", async function (req, res) {
  console.log(`routeC called from user ${req.headers["authorization"]}`);
  await forwardRequestHeaderToken(req);
  res.status(200).json("Success");
});

// // respond with "hello world" when a GET request is made to the homepage
// app.get("/testBodyToken", async function (req, res) {
//   await forwardRequestBodyToken(req);
//   res.status(200).json("Success");
// });

// app.get("/testWrongHeaderToken", async function (req, res) {
//   await forwardWrongRequestHeaderToken(req);
//   res.status(200).json(errorResponse.data);
// });

// app.get("/testWrongBodyToken", async function (req, res) {
//   var errorResponse = await forwardWrongRequestBodyToken(req);
//   res.status(200).json(errorResponse.data);
// });

// app.get("/testQueryParamToken", async function (req, res) {
//   await forwardRequestQueryParamToken(req);
//   res.status(200).json("Success");
// });

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log("Listening on port " + port);
});
