import React from "react";
import styled from "styled-components";
import Link from "react-router-dom/Link";
import { Button } from "./design/Button";

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
`;

const Name = styled.div`
  font-weight: bold;
  color: #06c4ff;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Game = ({ game }) => {
  return (
    <Container>
      <Name>{game.name}</Name>
      <Link
        to={`/game/profile/${game.id}`}
        style={{ textDecoration: "none", color: "white" }}
      >
        <UserName>{game.username}</UserName>
      </Link>
      <Id>Id: {game.id}</Id>

      <Link to={`/game/profile/${game.id}`} style={{ textDecoration: "none" }}>
        <ButtonContainer>
          <Button>Profile</Button>
        </ButtonContainer>
      </Link>
    </Container>
  );
};

export default Game;
