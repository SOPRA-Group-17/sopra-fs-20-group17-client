import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import GiveClue from "../../GiveClue/GiveClue";
import Evalution from "../../Evalution/Evalution";
import Validation from "../../validation/Validation"

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/game/:id" because as been passed as a prop in the parent of GameRouter,
     * add a guard each for active player actions and clue giver actions
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
        <Route
          exact
          path={`${this.props.base}/validation`}
          render={() => <Validation />}
        />

      </Container>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default GameRouter;
