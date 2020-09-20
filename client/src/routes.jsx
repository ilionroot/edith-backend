import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import oauth from "./pages/OAuth/oauth";
import Instagram from "./pages/Instagram/";
import Facebook from "./pages/Facebook/";
import NavBar from "./components/NavBar";

function Router() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route exact path="/" component={Instagram} />
      <Route path="/facebook" component={Facebook} />
      <Route path="/oauth2callback" component={oauth} />
      <Route path="/facebook/oauth2callback" component={oauth} />
    </BrowserRouter>
  );
}

export default Router;
