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
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

class EnterGuess extends React.Component {
  constructor() {
    super();
    // create a hint object for testing purposes
    var hint1 = new Hint();
    hint1.hints = ["yellow", "hot", "shine", "light"];

    // end of testing purposes

    this.state = {
      playerId: null,
      gameId: null,
      roundId: null,
      //hint: null,
      hint: hint1,
      hints: [],
      guess: null,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;
      this.state.roundId = this.props.match.params.roundId;

      // get all the given hints
      /*const response = await api.get(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`
      );
      console.log(response);
      this.setState({ hint: new Hint(response) });*/
      // assign the hints list of object hint to state variable hints in order to make it easier to work with the hints list
      this.setState({ hints: this.state.hint.hints });
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
        playerId: this.state.playerId,
        type: "guess",
      });
      const response = await api.post(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`,
        requestBody
      );

      console.log(response);
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
        playerId: this.state.playerId,
        type: "term",
      });
      const response = await api.delete(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`,
        requestBody
      );

      console.log(response);
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
      table.push(<tr class="text-white">{this.state.hints[i]}</tr>);
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

          <Row style={{ marginTop: "4vw" }}>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 3, offset: 0 }}></Col>
            <Col xs="7" md="3">
              <Table striped bordered hover size="sm">
                <thead class="text-white">
                  <tr>
                    <th>hints</th>
                  </tr>
                </thead>
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
            <Col
              xs={{ span: 0.5, offset: 0 }}
              md={{ span: 1, offset: 0 }}
            ></Col>
            <Col xs="7" md="3">
              <Row>
                <InputField
                  placeholder="Enter your guess here... "
                  onChange={(e) => {
                    this.handleInputChange("guess", e.target.value);
                  }}
                />
              </Row>
              <Row>
                <Col xs={{ span: 0.5, offset: 0 }} md={{ span: 1, offset: 0 }}>
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    disabled={!this.state.guess}
                    onClick={() => {
                      this.submit();
                    }}
                  >
                    Submit
                  </Button>
                </Col>
                <Col xs={{ span: 0.5, offset: 1 }} md={{ span: 1, offset: 2 }}>
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => {
                      this.skip();
                    }}
                  >
                    Skip
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(EnterGuess);
