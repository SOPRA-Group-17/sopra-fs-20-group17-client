import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter, useParams } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import aLobby from "../../views/aLobby";
import Game from "../shared/models/Game";
import { Spinner } from "../../views/design/Spinner";

class GiveClue extends React.Component {
  constructor() {
    super();

    this.state = {
      word: "Example",
      clue: null,
      gameId: null,
    };
  }

  async componentDidMount() {
    try {
      this.state.gameId = this.props.match.params.gameId;
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async submitClue() {
    try {
    } catch (error) {
      alert(
        `Something went wrong while submiting the clue \n${handleError(error)}`
      );
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs="5" md="3">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 7 }}>
            <Row className="d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
                size="lg"
              >
                Rules
              </Button>
            </Row>
          </Col>
        </Row>
        <div
          style={{ fontSize: "calc(1.2em + 4vw)" }}
          class="row justify-content-center"
        >
          <p style={{ fontFamily: "Merienda, cursive" }}>{this.state.word}</p>
        </div>
        <div class="row justify-content-center">
          <input
            style={{
              backgroundColor: "#291f33",
              border: "0.05vw solid white",
              padding: "0.5vw 0.5vw 0.5vw  1vw ",
              color: "white",
              width: "calc(8em + 23vw)",
              fontSize: "calc(1em + 1vw)",
            }}
            placeholder="Enter here your clue"
            onChange={(e) => {
              this.handleInputChange("clue", e.target.value);
            }}
          />
        </div>
        <div
          class="row justify-content-center"
          style={{ marginTop: "calc(1.5em + 1.5vw)" }}
        >
          <Button
            disabled={!this.state.clue}
            variant="outline-light"
            size="lg"
            onClick={() => {
              this.submitClue();
            }}
          >
            Submit
          </Button>
        </div>
      </Container>
    );
  }
}

export default withRouter(GiveClue);
