import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Game from "../../game/Game";
import Profile from "../../Profile/Profile";
import EditP

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
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
          path={`${this.props.base}/dashboard`}
          render={() => <Game />}
        />

       <Route
           exact
          path= {`${this.props.base}/profile/:id`}
          render={() => <Profile />}
       />

          <Route
              exact
              path= {`${this.props.base}/profile/:id`}
              render={() => <EditProfile />}
          />

        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/dashboard`} />}
        />

      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;
