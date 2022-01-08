let fs = require("fs");
let path = require("path");
const auth = require("../auth.json");

let fetch = require("node-fetch");
let express = require("express");

let PORT = process.env.PORT || 3000;
let REFRESH_TOKEN_PATH = path.resolve(
  __dirname,
  "../",
  "very-secure-refresh-token.txt"
);

let SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-modify-playback-state",
].join(" ");
let CLIENT_ID = auth.CLIENT_ID;
let CLIENT_SECRET = auth.CLIENT_SECRET;

let cache = new Map();

function setupSpotify(resolve) {
  let app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initieel setupke doen voor aan uw refresh token te geraken
  app.get("/callback", async (req, res) => {
    let form = new URLSearchParams();

    form.set("grant_type", "authorization_code");
    form.set("code", req.query.code);
    form.set("redirect_uri", `http://localhost:${PORT}/callback`);
    form.set("client_id", CLIENT_ID);
    form.set("client_secret", CLIENT_SECRET);

    let refresh_token = await fetch(
      "https://accounts.spotify.com/api/token?grant_type=authorization_code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: form,
      }
    )
      .then((response) => response.json())
      .then((json) => json.refresh_token);

    fs.writeFileSync(REFRESH_TOKEN_PATH, refresh_token, "utf8");

    process.nextTick(() => {
      server.close(() => {
        resolve();
      });
    });

    return res.json({ ok: "'t zou moeten werken, sjoarel!" });
  });

  let server = app.listen(PORT, () => {
    let url =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: `http://localhost:${PORT}/callback`,
      });

    console.log("Please visit the following URL to authorize this app:");
    console.log();
    console.log(url);
    console.log();
    return;
  });
}

async function getToken() {
  await new Promise((resolve) => {
    if (!fs.existsSync(REFRESH_TOKEN_PATH)) {
      setupSpotify(resolve);
    } else {
      resolve();
    }
  });

  if (cache.has("token")) {
    return cache.get("token");
  }

  return fetch(
    `https://accounts.spotify.com/api/token?${new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: fs.readFileSync(REFRESH_TOKEN_PATH, "utf8"),
    })}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          CLIENT_ID + ":" + CLIENT_SECRET
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      let token = `${json.token_type} ${json.access_token}`;
      cache.set("token", token);
      setTimeout(() => {
        cache.delete("token");
      }, json.expires_in * 1000 * 0.8);
      return token;
    });
}

module.exports = function spotify(endpoint, type, data) {
  if (data !== undefined && endpoint === "/me/player/play") {
    let context_uri = data.split(" ")[0];
    return getToken().then((token) => {
      return fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: type,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
        body: `{\n"context_uri": "${context_uri}",\n"offset":{\n"position":0\n}\n}`,
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 204) {
          return response.text();
        } else {
          return "Request_Error";
        }
      });
    });
  } else {
    return getToken().then((token) => {
      return fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: type,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: token,
        },
      }).then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 204) {
          return response.text();
        } else {
          return "Request_Error";
        }
      });
    });
  }
};
