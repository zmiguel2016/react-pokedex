//express server variables
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;
const request = require("request");
const bodyParser = require("body-parser");

//pokemon api url variables
const start_url = "https://pokeapi.co/api/v2/pokemon/?offset=";
const end_url = "&limit=20";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));

//pokemon api route : returns array of 20 pokemon
app.post("/api/pokemon/", async (req, res) => {
  let offset = req.body.page; //page offest
  var pokemon;
  var api_endpoint = start_url + offset + end_url; //api endpoint for a list of 20 pokemon
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

//pokemon api route : returns array of all pokemon
app.get("/api/allpokemon/", async (req, res) => {
  var pokemon;
  var api_endpoint = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1050"; //api endpoint for a list of all pokemon
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

//pokemon api route: returns a pokemon object
app.post("/api/pokeinfo/", async (req, res) => {
  let api_endpoint = req.body.url; //api endpoint for pokemon found from body url

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

//no request match
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//request api data from url
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

//server
app.listen(port);
