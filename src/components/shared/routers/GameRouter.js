import React from "react";
import styled from "styled-components";
import { Route } from "react-router-dom";
import GiveClue from "../../GiveClue/GiveClue";
import Evalution from "../../Evalution/Evalution";
import Validation from "../../validation/Validation";
import EnterGuess from "../../game/EnterGuess";
import Score from "../../game/Score";
import Number from "../../number/Number";
import ReportWord from "../../ReportWord/ReportWord";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;


class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/game/:id" because as been passed as a prop in the parent of GameRouter,
          
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
          path={`${this.props.base}/enterGuess`}
          render={() => <EnterGuess />}
        />
        <Route
          exact
          path={`${this.props.base}/reportWord`}
          render={() => <ReportWord />}
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

        <Route
          exact
          path={`${this.props.base}/number`}
          render={() => <Number />}
        />

        <Route
          exact
          path={`${this.props.base}/score`}
          render={() => <Score />}
        />
      </Container>
    );
  }
}
/*
 * Don't forget to export your component!
 */
export default GameRouter;
