import React from "react";
import logo from "../styling/JustOne_logo_white.svg";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../../views/design/Spinner";
import Rules from "../rules/Rules";
import ProgressBar from "react-bootstrap/ProgressBar";

const bignumbers = {
  fontSize: "18vw",
  textAlign: "center",
  opacity: 0.4,
  cursor: "pointer",
};
const sentence = {
  fontSize: "5vw",
  textAlign: "center",
  opacity: 0.4,
};

const progressbar = {
  width: "22vw",
};

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null,
      game: null,
      gameStatus: null,
      chosenNumber: [],
      readyToRender: true,
      readyForNext: false,
      hide1: false,
      hide2: false,
      hide3: false,
      hide4: false,
      hide5: false,
      rules: false,
      progressBar: null,
      endGame: false,
    };
  }

  async componentDidMount() {
    try {
      //console.log(localStorage);
      //id aus url
      this.setState({
        gameId: this.props.match.params.gameId,
      });

      this.setNumberState();

      //poll every 1 seconds all players, search game
      this.timer = setInterval(() => this.getGameStatus(), 1000);
      this.timerGameEnded = setInterval(() => this.checkGameEnded(), 1100);
    } catch (error) {
      alert(
        `Something went wrong while componentDidMount: \n${handleError(error)}`
      );
    }
  }
  async getGameStatus() {
    try {
      this.checkGameEnded();
      console.log("number timer");
      //if the game is not ready for the next page then we are waiting and ask for the state again
      if (!this.state.readyForNext) {
        //get the game and its status
        const get_game = await api.get(`/games/${this.state.gameId}`);
        this.setState({
          game: get_game.data,
          gameStatus: get_game.data.status,
        });

        //game state changes to RECEIVING GUESS then change the helper states
        if (get_game.data.status === "RECEIVING_GUESS") {
          this.setState({
            readyForNext: true,
            readyToRender: false,
          });
        }
        //game state changes to RECEIVING TERM then change the helper states
        if (get_game.data.status === "RECEIVING_TERM") {
          this.setState({
            readyForNext: false,
            readyToRender: true,
          });
        } else {
          this.setState({
            readyToRender: false,
          });
        }
        this.waitingBar();
      }
      //game is in RECEIVING GUESS status and can be pushed to enter guess
      // deleting timer before going
      else {
        //clear timer and push to enter guess
        clearInterval(this.timer);
        this.timer = null;
        this.props.history.push(`/game/${this.state.gameId}/enterguess`);
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the game: \n${handleError(error)}`
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //just as a reminder - not used yet
    // gets called every time the component changes (also state changes)
    // you could also compare the prevState with the current state
    // and then save it if something changed
  }

  //change the number state
  changeNumberState(number) {
    this.setState(
      {
        chosenNumber: number,
        readyToRender: false,
      },
      this.saveChange
    );
    this.saveChangeAlternative(number);
  }

  //change the number state with another method
  handleNumberClickAlternative(number) {
    this.setState({
      chosenNumber: number,
      readyToRender: false,
    });
    this.saveChangeAlternative(number);
  }

  //save the change and send the wordId chosen to the backend
  async saveChangeAlternative(number) {
    try {
      this.checkGameEnded();
      let requestBody;

      requestBody = JSON.stringify({
        wordId: number - 1,
        token: localStorage.getItem("token"),
      });

      await api.post(`/games/${this.state.gameId}/terms`, requestBody);

      // Get the existing data
      var existing = localStorage.getItem("chosen_nr");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(",") : [];

      // Add new data to localStorage Array
      existing.push(number);
      console.log(existing);
      //check how many times the player has to take the word again (if five times, then word has to be considered as known and then redirected to the hint screen the others)
      if (existing) {
        console.log(existing.length);

        if (existing.length > 4) {
          this.allKnowTheWord();
        }
      }

      // Save back to localStorage
      localStorage.setItem("chosen_nr", existing.toString());

      //helper state to check if number should be hidden or not
      this.setNumberState(number);
    } catch (error) {
      alert(
        `Something went wrong while setting the term: \n${handleError(error)}`
      );
    }
  }

  //when all possibilities of the card are gone, then the last word on the card should be taken. The users do not have the possibility to report this word.
  //if all know the word the game state automatically updates
  async allKnowTheWord() {
    try {
      this.checkGameEnded();
      //get all players in the game
      //set player and playerstatus
      const allPlayers = await api.get(`/games/${this.state.gameId}/players`);
      console.log(allPlayers.data);
      for (let i = 0; i < allPlayers.data.length; i++) {
        if (allPlayers.data[i].status !== "GUESSER") {
          console.log(allPlayers.data[i].id);
          //this player has to know the word
          let requestBody;

          requestBody = JSON.stringify({
            playerTermStatus: "KNOWN",
          });

          await api.put(
            `/games/${this.state.gameId}/players/${allPlayers.data[i].id}`,
            requestBody
          );
        }
      }
    } catch (error) {
      alert(
        `Something went wrong while updating the player: \n${handleError(
          error
        )}`
      );
    }
  }

  //change the number state with another method
  async handleNumberClick(number) {
    this.checkGameEnded();

    this.setState({ chosenNumber: number });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call delay of 1second

      this.saveChangeAlternative(number);
    } catch (error) {
      console.log(error);
    }
  }

  //which states has already been chosen, hide them
  //here set the states for the hiding
  setNumberState() {
    if (localStorage.getItem("chosen_nr")) {
      if (this.checkIfNumberAlreadyUsed(1)) {
        this.setState({
          hide1: true,
        });
      } else {
        this.setState({
          hide1: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(2)) {
        this.setState({
          hide2: true,
        });
      } else {
        this.setState({
          hide2: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(3)) {
        this.setState({
          hide3: true,
        });
      } else {
        this.setState({
          hide3: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(4)) {
        this.setState({
          hide4: true,
        });
      } else {
        this.setState({
          hide4: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(5)) {
        this.setState({
          hide5: true,
        });
      } else {
        this.setState({
          hide5: false,
        });
      }
    }
  }

  //checks if the number was already taken by the user
  checkIfNumberAlreadyUsed(number) {
    return localStorage.getItem("chosen_nr").includes(number.toString());
  }

  waitingSentence() {
    if (this.state.gameStatus === "VALIDATING_TERM") {
      return "the word is getting validated";
    } else if (this.state.gameStatus === "RECEIVING_HINTS") {
      return "the hints are getting sent";
    } else if (this.state.gameStatus === "VALIDATING_HINTS") {
      return "the hints are getting validated";
    } else {
      return "waiting";
    }
  }
  async waitingBar() {
    try {
      this.checkGameEnded();
      //get all players in the game
      //set player and playerstatus
      const allPlayers = await api.get(`/games/${this.state.gameId}/players`);
      //-1 because of the guesser
      let amountPlayers = allPlayers.data.length - 1;
      const hints = await api.get(`/games/${this.state.gameId}/hints`);

      let amountHints = amountPlayers * amountPlayers;
      console.log(amountHints);
      let sum = 0;

      let percentage;
      for (let i = 0; i < allPlayers.data.length; i++) {
        if (allPlayers.data[i].status !== "GUESSER") {
          if (this.state.gameStatus === "VALIDATING_TERM") {
            console.log(allPlayers.data[i].playerTermStatus);
            if (allPlayers.data[i].playerTermStatus !== "NOT_SET") {
              sum++;
            }
            percentage = (sum / amountPlayers) * 100;
          } else if (this.state.gameStatus === "RECEIVING_HINTS") {
            sum = hints.data.length;
            percentage = (sum / amountPlayers) * 100;
          } else if (this.state.gameStatus === "VALIDATING_HINTS") {
            if (hints.data[i]) {
              if (hints.data[i].reporters) {
                console.log(hints.data[i].reporters.length);
                sum += hints.data[i].reporters.length;
                console.log(sum);
              }
            }
            percentage = (sum / amountHints) * 100;
            console.log(percentage);
          }
        }
      }

      this.setState({
        progressBar: percentage,
      });
    } catch (error) {
      alert(
        `Something went wrong while getting hints or players: \n${handleError(
          error
        )}`
      );
    }
  }

  async endGame() {
    try {
      const requestBody = JSON.stringify({
        status: "FINISHED",
      });
      await api.put(`/games/${this.state.gameId}`, requestBody);
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerGameEnded);
      this.timerGameEnded = null;
      this.props.history.push(`/game/${this.state.gameId}/Score`);
    } catch (error) {
      alert(
        `Something went wrong while trying to end the game: \n${handleError(
          error
        )}`
      );
    }
  }
  async checkGameEnded() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if (response.data.status === "FINISHED") {
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
    } catch (error) {
      alert(
        `Something went wrong while checking if the game has ended: \n${handleError(
          error
        )}`
      );
    }
  }

  render() {
    return (
      <Container fluid>
        {this.getGameStatus}

        {console.log(this.state.gameStatus)}

        <Row>
          {" "}
          <Col xs="5" md="2">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 5, offset: 2 }} md={{ span: 2, offset: 8 }}>
            <Row className="d-flex justify-content-end">
              <Button
                variant="outline-danger"
                className="outlineWhite-Dashboard"
                onClick={() => this.setState({ endGame: true })}
              >
                End Game
              </Button>
            </Row>
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
        <Modal
          size="lg"
          show={this.state.endGame}
          onHide={() => this.setState({ endGame: false })}
          aria-labelledby="rules-dashboard"
        >
          <Modal.Header closeButton className="rules-header">
            <Modal.Title id="rules-dashboard-title" className="rules-header">
              End Game
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="rules-text">
            <p className="rules-text">
              Are you sure that you want to end the game? This will end the game
              for all players.
            </p>
            <Button
              variant="outline-danger"
              size="lg"
              className="outlineWhite-Dashboard"
              onClick={() => this.endGame()}
            >
              YES
            </Button>
          </Modal.Body>
        </Modal>
        {!this.state.readyToRender ? (
          <div style={{ marginTop: "8vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>

            <div
              class="row justify-content-center"
              style={{ marginTop: "2vw" }}
            >
              <p className="large-Font">{this.waitingSentence()}</p>
            </div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "2vw" }}
            >
              <Row>
                <ProgressBar
                  style={progressbar}
                  striped
                  variant="success"
                  now={this.state.progressBar}
                />
              </Row>
            </div>
          </div>
        ) : (
          <div>
            <Row>
              <Col>
                <p style={sentence}>Pick a number</p>
                <p>
                  {
                    //JSON.stringify(this.state)}
                  }
                </p>
              </Col>
            </Row>

            <Row>
              <Col xs={{ span: 2 }} md={{ span: 1 }}></Col>
              <Col xs="4" md="2">
                {!this.state.hide1 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.handleNumberClickAlternative(1);
                    }}
                  >
                    1
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide2 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.handleNumberClickAlternative(2);
                    }}
                  >
                    2
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide3 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(3);
                    }}
                  >
                    3
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide4 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(4);
                    }}
                  >
                    4
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide5 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(5);
                    }}
                  >
                    5
                  </p>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Number);
