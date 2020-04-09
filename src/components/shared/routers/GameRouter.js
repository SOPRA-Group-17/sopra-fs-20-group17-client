import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Game from "../../game/Game";
import Profile from "../../Profile/Profile";
import EditProfile from "../../Profile/EditProfile";
import GiveClue from "../../GiveClue/GiveClue";
import Evalution from "../../Evalution/Evalution";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/game/:id" because as been passed as a prop in the parent of GameRouter,
     *
     */

    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/giveClue`}
          render={() => <GiveClue />}
        />
        <Route
          exact
          path={`${this.props.base}/evalution`}
          render={() => <Evalution />}
        />

      </Container>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default GameRouter;
