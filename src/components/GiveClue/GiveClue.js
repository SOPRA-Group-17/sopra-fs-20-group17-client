import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter,} from "react-router-dom";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";
import Rules from "../rules/Rules";

class GiveClue extends React.Component {
  constructor() {
    super();

    this.state = {
      word: null,
      clue: null,
      gameId: null,
      token: null,
      timer: null,
      rules: false,
    };
  }

  async componentDidMount() {
    try {
      this.state.gameId = this.props.match.params.gameId;
      this.state.id = localStorage.getItem("Id");
      this.state.token = localStorage.getItem("token");

      this.checkTermAvailible();

      this.timer = setInterval(() => this.checkTermAvailible(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }

  async checkTermAvailible() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);

      // check if game ready to give hints
      console.log(response.data.status);
      if (response.data.status === "RECEIVING_HINTS") {
        clearInterval(this.timer);
        this.timer = null;
        this.getTerme();
      }
    } catch (error) {
      alert(
        `Something went wrong while checking the game status: \n${handleError(
          error
        )}`
      );
    }
  }

  async getTerme() {
    try {
      console.log("get Till here");
      const response = await api.get(`/games/${this.state.gameId}/terms`);

      // Get the returned terme and update the state.
      this.setState({ word: response.data.content });
      console.log(this.state.word);
    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }

  async submitClue() {
    try {
      const requestBody = JSON.stringify({
        content: this.state.clue,
        token: this.state.token,
      });
      console.log(this.state.newGame);
      const response = await api.post(
        `/games/${this.state.gameId}/hints`,
        requestBody
      );

      console.log(response);

      this.props.history.push(`/game/${this.state.gameId}/validation`);
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
                onClick={() => this.setState({ rules: true })}
              >
                Rules
              </Button>
            </Row>
          </Col>
        </Row>
        <Modal
          size="lg"
          show={this.state.rules}
          onHide={() => this.setState({ rules: false })}
          aria-labelledby="rules-dashboard"
        >
          <Rules />
        </Modal>
        {!this.state.word ? (
          <div style={{ marginTop: "5vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for the word to guess</p>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{ fontSize: "calc(1.2em + 4vw)" }}
              class="row justify-content-center"
            >
              <p style={{ fontFamily: "Merienda, cursive" }}>
                {this.state.word}
              </p>
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
                placeholder="Enter your clue here"
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
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(GiveClue);
