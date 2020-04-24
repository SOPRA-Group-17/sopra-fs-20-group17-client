import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

class Evalution extends React.Component {
  constructor() {
    super();

    this.state = {
      gameId: null,
      word: null,
      guess: "Guesser didn´t give his guess yet",
      timer: null,
      gameStatus: null,
      readyToRender: null,
      guessCorrect: null,
      color: "white",
      skiped: null,
    };
  }

  async componentDidMount() {
    try {
      console.log("comp");
      this.state.gameId = this.props.match.params.gameId;
      this.state.id = localStorage.getItem("Id");
      this.state.token = localStorage.getItem("token");

      this.getGuessAndTerm();

      this.timer = setInterval(() => this.getGuessAndTerm(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }
  async getGuessAndTerm() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      this.setState({ gameStatus: response.data.status });
      // check if game ready to give hints
      console.log(response.data.status);
      if (
        response.data.status === "FINISHED" ||
        response.data.status === "RECEIVING_TERM"
      ) {
        const response2 = await api.get(
          `/games/${this.state.gameId}/rounds?lastRound=true`
        );

        //setting term
        this.setState({ word: response2.data[0].term.content });

        //setting if guess was correct or not
        if (response2.data[0].guess.status == "VALID") {
          this.setState({ guessCorrect: "correct" });
          this.setState({ color: "green" });
          //setting guess
          this.setState({ guess: response2.data[0].guess.content });
        } else if (response2.data[0].guess.status == "INVALID") {
          this.setState({ guessCorrect: "incorrect" });
          this.setState({ color: "red" });
          //setting guess
          this.setState({ guess: response2.data[0].guess.content });
        } else {
          this.setState({ skiped: true });
        }

        this.setState({ readyToRender: true });

        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => this.startNewRound(), 8000);
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the guess: \n${handleError(error)}`
      );
    }
  }

  async startNewRound() {
    try {
      console.log("starting new round");
      console.log(localStorage);
      clearInterval(this.timer);
      this.timer = null;

      const Player = await api.get(`/games/players/${this.state.id}`);
      console.log(Player.data);
      if (this.state.gameStatus == "RECEIVING_TERM") {
        console.log(Player.data.status);
        if (Player.data.status === "GUESSER") {
          localStorage.setItem("role", "GUESSER");
          this.props.history.push(`/game/${this.state.gameId}/number`);
        } else if (Player.data.status === "CLUE_GIVER") {
          localStorage.setItem("role", "CLUE_GIVER");
          this.props.history.push(`/game/${this.state.gameId}/reportWord`);
        }
      } else if (this.state.gameStatus == "FINISHED") {
        //update the url
        this.props.history.push(`/game/${this.state.ID_game}/Score`);
      }
    } catch (error) {
      alert(`Something while starting the new round: \n${handleError(error)}`);
    }
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
        {!this.state.readyToRender ? (
          <div style={{ marginTop: "5vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for the guess</p>
            </div>
          </div>
        ) : (
          <div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "calc(0.5em + 0.5vw)" }}
            >
              <p className="large-Font" hidden={!this.state.skiped}></p>
              <p
                className="large-Font"
                style={{ color: this.state.color }}
                hidden={this.state.skiped}
              >
                The given guesse is {this.state.guessCorrect}
              </p>
            </div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "calc(0.5em + 0.5vw)" }}
            >
              <p className="large-Font">Given word: {this.state.word}</p>
            </div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "calc(0.5em + 0.5vw)" }}
              hidden={this.state.skiped}
            >
              <p className="large-Font">Guess: {this.state.guess}</p>
            </div>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Evalution);
