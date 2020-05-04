import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import Rules from "../rules/Rules";
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
      rules: false,
      token:null,
      id:null,
      score:null,
      timerDown: null,
      timeNewRound: 10
    };
  }

  async componentDidMount() {
    try {
      //remove chosen_nr, then in the next round are no problems with the number screen
      localStorage.removeItem("chosen_nr");
      console.log("comp");
      this.state.gameId = this.props.match.params.gameId;
      this.state.id = localStorage.getItem("Id");
      this.state.token = localStorage.getItem("token");

      this.getScore();
      this.getGuessAndTerm();

      this.timer = setInterval(() => this.getGuessAndTerm(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }

  async getScore() {
    try {
      const players = await api.get(`/games/${this.state.gameId}/players`);

      players.data.forEach(player => {
        if(this.state.id == player.id){
          this.setState({score: player.score})
        }
      });
     
    } catch (error) {
      alert(
        `Something went wrong while getting the score: \n${handleError(error)}`
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
        //checking if guess null, happens if guesser skipped
        if (!response2.data[0].guess) {
          this.setState({ skiped: true });
          console.log("Skiped");
        } else {
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
          }
        }

        this.setState({ readyToRender: true });

        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => this.startNewRound(), 9800);
        this.timerDown = setInterval(() => this.decreaseTime(), 1000);
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the guess: \n${handleError(error)}`
      );
    }
  }

  decreaseTime(){
    if(this.state.timeNewRound > 0){
      this.setState({timeNewRound: this.state.timeNewRound-1  })
    }
  }

  async startNewRound() {
    try {
      console.log("starting new round");
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerDown);
      this.timerDown = null;

      const Player = await api.get(`/games/players/${this.state.id}`);
      console.log(Player.data);
      if (this.state.gameStatus == "RECEIVING_TERM") {
        console.log(Player.data.status);
        if (Player.data.status === "GUESSER") {
          localStorage.setItem("status", "GUESSER");
          this.props.history.push(`/game/${this.state.gameId}/number`);
        } else if (Player.data.status === "CLUE_GIVER") {
          localStorage.setItem("status", "CLUE_GIVER");
          this.props.history.push(`/game/${this.state.gameId}/reportWord`);
        }
      } //check if this works, is Finished the correct state
      else if (this.state.gameStatus == "FINISHED") {
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
    } catch (error) {
      alert(`Something while starting the new round: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      
      
      <Container fluid>
        {!this.state.readyToRender ? (
        <div>
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
        
          <div style={{ marginTop: "5vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for the guess</p>
            </div>
          </div>
          </div>
        ) : (
          <div>   
          <Row>
          <Col xs="5" md="3">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 6, offset: 1 }} md={{ span: 4, offset: 5 }}>
            <Row className="d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
                onClick={() => this.setState({ rules: true })}
              >
                Rules
              </Button>
            </Row>
            <Row className="d-flex justify-content-end">
              <p className = "score">
                Your current score: {this.state.score}
              </p>

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
          <div>
            <div class="row justify-content-center">
              <p className="large-Font" hidden={!this.state.skiped}>
                The guesser skipped the word
              </p>
              <p
                className="large-Font"
                style={{ color: this.state.color }}
                hidden={this.state.skiped}
              >
                The given guess is {this.state.guessCorrect}
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
            <div
              class="row justify-content-center"
              style={{ marginTop: "calc(0.5em + 0.5vw)" }}
            >
              <p className="medium-Font-grey">
                {" "}
                New round will start in {this.state.timeNewRound} seconds
              </p>
            </div>
            
          </div>
           
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Evalution);
