import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import LobbyRouter from "./LobbyRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
import Login from "../../login/Login";
import Register from "../../Register/Register";
import Lobbyboard from "../../lobby/Lobby";
import { LobbyGuard } from "../routeProtectors/LobbyGuard";
import { DashboardGuard } from "../routeProtectors/DashboardGuard";
import Dashboard from "../../dashboard/Dashboard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */

/**didnt add registerguard yet, what can it be used for*/
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
            <Route
              path="/game"
              render={() => (
                <GameGuard>
                  <GameRouter base={"/game"} />
                </GameGuard>
              )}
            />

            <Route
              path="/lobby"
              render={() => (
                <LobbyGuard>
                  <LobbyRouter base={"/lobby"} />
                </LobbyGuard>
              )}
            />
            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />

            <Route
              path="/register"
              exact
              render={() => (
                <RegisterGuard>
                  <Register />
                </RegisterGuard>
              )}
            />

            <Route
              path="/dashboard/:id"
              exact
              render={() => (
                <DashboardGuard>
                  <Dashboard />
                </DashboardGuard>
              )}
            />

            <Route path="/" exact render={() => <Redirect to={"/game"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default AppRouter;
