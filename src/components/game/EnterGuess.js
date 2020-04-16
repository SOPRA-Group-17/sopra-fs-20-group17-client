import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import Hint from "../shared/models/Hint";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 420px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(42, 33, 79), rgb(30, 18, 43));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1);
  }
  height: 35px;
  width: 25%;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const bigbutton = {
  padding: "0.5vw 1.5vw 0.5vw 1.5vw",
  //top right bottom left
};

class EnterGuess extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: null,
      playerId: null,
      gameId: null,
      roundId: null,

      hints: ["yellow", "hot", "shine", "light"],
      //hints: [],
      guess: null,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerToken = localStorage.getItem("token");
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;
      this.state.roundId = this.props.match.params.roundId;

      // get all the given hints
      // TODO: adapt the url
      const response = await api.get(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`
      );
      console.log(response);
      this.setState({ hints: response });
    } catch (error) {
      alert(
        `Something went wrong while loading the player's hints: \n${handleError(
          error
        )}`
      );
    }
  }

  async submit() {
    try {
      const requestBody = JSON.stringify({
        guess: this.state.guess,
        gameId: this.state.gameId,
        roundId: this.state.roundId,
        playerToken: this.state.playerToken,
      });
      // TODO: adapt url and request parameters
      const response = await api.post(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`,
        requestBody
      );

      console.log(response);
      // TODO: what is the url of the page you are directed to?
      // this.props.history.push(`/Login`);
    } catch (error) {
      alert(
        `Something went wrong while submitting the guess: \n${handleError(
          error
        )}`
      );
    }
  }

  async skip() {
    try {
      const requestBody = JSON.stringify({
        gameId: this.state.gameId,
        roundId: this.state.roundId,
        playerToken: this.state.playerToken,
      });
      // TODO: adapt url and request parameters
      const response = await api.delete(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`,
        requestBody
      );

      console.log(response);
      // TODO: what is the url of the page you are directed to?
      // this.props.history.push(`/Login`);
    } catch (error) {
      alert(`Something went wrong while skipping: \n${handleError(error)}`);
    }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  createTable = () => {
    let table = [];

    for (let i = 0; i < this.state.hints.length; i++) {
      table.push(
        <tr class="text-white" class="text-center">
          {this.state.hints[i]}
        </tr>
      );
    }

    return table;
  };

  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col xs="5" md="3">
              <img
                className="logoImgSmall"
                src={logo}
                alt="Just One Logo"
              ></img>
            </Col>
            <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 7 }}>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                >
                  Rules
                </Button>
              </Row>
            </Col>
          </Row>

          <Row style={{ marginTop: "4vw", marginBottom: "4vw" }}>
            <Col xs={{ span: 4, offset: 4 }} md={{ span: 4, offset: 4 }}>
              <Table bordered size="sm">
                <thead class="text-white">
                  <tr>
                    <th class="text-center">hints</th>
                  </tr>
                </thead>
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center">
            <InputField
              placeholder="Enter your guess here... "
              onChange={(e) => {
                this.handleInputChange("guess", e.target.value);
              }}
            />
          </Row>

          <Row>
            <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 5 }}>
              <Row className="d-flex justify-content-center">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  block="true"
                  disabled={!this.state.guess}
                  onClick={() => {
                    this.submit();
                  }}
                >
                  Submit
                </Button>
              </Row>
            </Col>
          </Row>

          <Row class="row justify-content-center">
            <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 5 }}>
              <Row className="d-flex justify-content-center">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  block="true"
                  onClick={() => {
                    this.skip();
                  }}
                >
                  Skip
                </Button>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(EnterGuess);
