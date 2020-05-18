import React from "react";
import { Redirect } from "react-router-dom";

//TODO: ask how to do the lobbyguard

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 *
 *
 */
export const LobbyHostGuard = (props) => {
  if (localStorage.getItem("role") === "HOST") {
    return props.children;
  } else if (localStorage.getItem("token")) {
    return <Redirect to={`/lobby/${localStorage.getItem("gameId")}/guest`} />;
  }
};
