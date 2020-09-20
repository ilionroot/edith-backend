import React, { useState, useEffect } from "react";

import api from "../../services/api";

import "./styles.css";

function Container({ title, placeholder }) {
  const [express, setExpress] = useState({});
  const [id, setId] = useState("");
  const [videos, setVideos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");

  async function getInfo() {
    const response = await api("/");

    if (response.status !== 200) throw Error("Error");

    return setExpress(response.data);
  }

  async function sendVideoInfos() {
    console.log(title);
    const response = await api(title === "Instagram" ? "/" : "/facebook", {
      method: "POST",
      data: {
        id,
      },
    });

    window.location = response.data;
  }

  useEffect(() => {
    getInfo();

    (async () => {
      const logs = (await api.get("/videos-instagram")).data;
      await setVideos(logs);
    })();
  }, []);

  return (
    <div className="container">
      <div className="video">
        <div className="infos">
          <h1>{title}</h1>
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => {
              return setId(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Título"
            onChange={(e) => {
              return setTitulo(e.target.value);
            }}
          />
          <textarea
            onChange={(e) => {
              return setDesc(e.target.value);
            }}
            placeholder="Descrição...."
          />
          <input type="button" onClick={sendVideoInfos} value="Enviar vídeo" />{" "}
        </div>

        <div className="videos">
          {videos.map((video) => {
            return (
              <div
                key={video.id}
                className="block"
                style={{
                  backgroundImage: "url(" + video.thumbnail_url + ")",
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <br />
      <h5>
        Back-end: {express.express === "On-line" ? express.express : "Off-line"}
      </h5>
    </div>
  );
}

export default Container;
