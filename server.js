const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;
const request = require("request");
const start_url = "https://pokeapi.co/api/v2/pokemon/?offset=";
const end_url = "&limit=20";
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
}

//build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/public/index.html"));
});

app.post("/api/pokemon/", async (req, res) => {
  let offset = req.body.page;
  var pokemon;
  var api_endpoint = start_url + offset + end_url;
  try {
    let res = await doRequest({
      url: api_endpoint,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res) {
      pokemon = JSON.parse(res.body);
    }
  } catch (err) {
    console.log(err);
  }

  res.json(pokemon);
});

app.get("/api/allpokemon/", async (req, res) => {
  var pokemon;
  var api_endpoint = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1050";
  try {
    let res = await doRequest({
      url: api_endpoint,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res) {
      pokemon = JSON.parse(res.body);
    }
  } catch (err) {
    console.log(err);
  }

  res.json(pokemon);
});

app.post("/api/pokeinfo/", async (req, res) => {
  let api_endpoint = req.body.url;

  var pokemon;

  try {
    let res = await doRequest({
      url: api_endpoint,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res) {
      pokemon = JSON.parse(res.body);
    }
  } catch (err) {
    console.log(err);
  }

  res.json(pokemon);
});

//const port = 5000;

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(res);
      } else {
        reject(error);
      }
    });
  });
}

app.listen(port, () => console.log(`Server running on port ${port}`));
