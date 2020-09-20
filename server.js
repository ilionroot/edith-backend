import express from "express";
const app = express();
const port = process.env.PORT | 5000;

import cors from "cors";
import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import path from "path";
import save from "instagram-save";

import fb from "fbvideos";

import Youtube from "./lib/index.js";
import readJson from "r-json";
import Spi from "cli-spinner";

const Spinner = Spi.Spinner;

const spinner = new Spinner("uploading.. %s");
const CREDENTIALS = readJson(`${path.resolve(".")}/credentials.json`);

spinner.setSpinnerString("|/-\\");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getVideo = async (url) => {
  console.log(url);
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const videoString = $("title").text(); //.attr('content');
  console.log(videoString);

  return videoString;
};

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.json({ express: "On-line" });
});

app.get("/facebook", async (req, res) => {
  res.sendFile(path.resolve(".", "facebook.html"));
});

app.post("/", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json({ alert: "Please insert an id!" });
  }

  console.log("Fazendo busca...");

  const title = await getVideo(`https://www.instagram.com/p/${id}`);

  try {
    save(id, `./videos/`).then(async (resp) => {
      console.log(title);
      const newTitle = title.split("Instagram: ")[1];
      const { description } = req.body;
      await fs.rename(resp.file, `./videos/${newTitle}.mp4`, () => {
        const cb = (err, video) => {};

        let oauth = Youtube.authenticate({
          type: "oauth",
          client_id: CREDENTIALS.web.client_id,
          client_secret: CREDENTIALS.web.client_secret,
          redirect_url: CREDENTIALS.web.redirect_uris[0],
        });

        res.send(
          oauth.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/youtube.upload"],
          })
        );

        app.get("/oauth2callback", async (req, res) => {
          let code = req.query.code;
          console.log(
            "Trying to get the token using the following code: " + code
          );
          oauth.getToken(code, (err, tokens) => {
            if (err) {
              res.status(400).json({ error: "Erro: " + err });
            }

            console.log("Got the tokens");
            oauth.setCredentials(tokens);
            console.log(
              "The video is being uploaded! Check out the logs in the terminal..."
            );

            var request = Youtube.videos.insert(
              {
                resource: {
                  snippet: {
                    title: newTitle,
                    description: description,
                  },
                  status: {
                    privacyStatus: "private",
                  },
                },
                part: "snippet,status",
                media: {
                  body: fs.createReadStream(`./videos/${newTitle}.mp4`),
                },
              },
              (err, data) => {
                if (err) {
                  return console.log(err);
                }

                console.log("Done.");
                spinner.stop(true);
              }
            );
          });

          spinner.start();
          res.json({ message: "Your video is being processed!" });
        });
      });
    });
  } catch (error) {
    res.json({
      error: `Um erro ocorreu: ${error}`,
    });
  }
});

app.post("/facebook", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json({ alert: "Please insert an id!" });
  }

  console.log("Fazendo busca...");

  const title = await getVideo(`https://www.facebook.com/watch/?v=${id}`);

  fb.low(`https://www.facebook.com/watch/?v=${id}`)
    .then(async (video) => {
      console.log(video.url);

      const response = await axios({
        method: "GET",
        url: video.url,
        responseType: "stream",
      });

      const directory = `./videos/${title}.mp4`;

      response.data.pipe(fs.createWriteStream(directory));

      return new Promise((resolve, reject) => {
        let length = response.headers["content-length"] / 1000000;
        console.log(length);

        response.data.on("end", async () => {
          const { description } = req.body;

          await fs.rename(directory, `./videos/${title}.mp4`, () => {
            const cb = (err, video) => {};

            let oauth = Youtube.authenticate({
              type: "oauth",
              client_id: CREDENTIALS.web.client_id,
              client_secret: CREDENTIALS.web.client_secret,
              redirect_url: CREDENTIALS.web.redirect_uris[1],
            });

            res.send(
              oauth.generateAuthUrl({
                access_type: "offline",
                scope: ["https://www.googleapis.com/auth/youtube.upload"],
              })
            );

            app.get("/facebook/oauth2callback", async (req, res) => {
              let code = req.query.code;
              console.log(
                "Trying to get the token using the following code: " + code
              );
              oauth.getToken(code, async (err, tokens) => {
                if (err) {
                  res.status(400).json({ error: "Erro: " + err });
                }

                console.log("Got the tokens");
                await oauth.setCredentials(tokens);
                console.log(
                  "The video is being uploaded! Check out the logs in the terminal..."
                );

                var request = Youtube.videos.insert(
                  {
                    resource: {
                      snippet: {
                        title: title,
                        description: description,
                      },
                      status: {
                        privacyStatus: "private",
                      },
                    },
                    part: "snippet,status",
                    media: {
                      body: fs.createReadStream(`./videos/${title}.mp4`),
                    },
                  },
                  (err, data) => {
                    if (err) {
                      return console.log(err);
                    }

                    console.log("Done.");
                    spinner.stop(true);
                  }
                );
              });

              spinner.start();
              res.json({ message: "Your video is being processed!" });
            });

            resolve();
          });
        });

        response.data.on("error", (err) => {
          reject(err);
        });
      });
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/videos-instagram", async (req, res) => {
  let {
    data: { data },
  } = await axios({
    method: "GET",
    url:
      "https://graph.instagram.com/me/media?fields=thumbnail_url,media_url,media_type,permalink&access_token=IGQVJWTXcwYWhlYWtjajR5S1ZApUjg5aDB5UDNqd3I0XzVOdEJRN29FNUlDT3JDenlxMng2b3JjTVZAnWkFuaDZADR0d6cE1ONlcwdmRkU0h3RzFKcndtdDk1clYtSlpnd19EODJXaENzMlBwcnNXenEtVGY1eGFUaFJzVWpn",
  });

  let videos = [];

  data.map((post) => {
    if (post.media_type == "VIDEO") {
      videos.push(post);
    }
  });

  res.send(videos);
});

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}...`);
});
