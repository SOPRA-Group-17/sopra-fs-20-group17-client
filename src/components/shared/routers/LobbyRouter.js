import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import { LobbyGuard } from "../routeProtectors/LobbyGuard";
import Lobby from "../../lobby/Lobby";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class LobbyRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     *
     *  left away exact with profile, so that no matter of the id at the end of the url the routing works
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/:gameId/host`}
          render={() => <Lobby />}
        />

        <Route
          exact
          path={`${this.props.base}/:gameId/guest`}
          render={() => <Lobby />}
        />
      </Container>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default LobbyRouter;

/*
                    <Route
              path="/lobby"
              exact
              render={() => (
                  <LobbyGuard>
                      <Lobbyboard />
                  </LobbyGuard>
              )}
          />

          */
