import React, { useEffect } from "react";

import api from "../../services/api";

function Oauth() {
  async function continuar() {
    const url = window.location.href.replace("http://", "").split("/")[1];
    console.log(url);

    const response = await api(url, {
      method: "GET",
    }); // CDz-u1uDvN_

    console.log(response);
  }

  useEffect(() => {
    continuar();
  }, []);

  return (
    <div className="container">
      <h1>OAUTH</h1>
    </div>
  );
}

export default Oauth;
