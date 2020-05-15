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
      ID_game: null,
      game: null,
      game_status: null,
      chosen_number: [],
      readyToRender: true,
      readyForNext: false,
      hide1: false,
      hide2: false,
      hide3: false,
      hide4: false,
      hide5: false,
      rules: false,
      progressBar: null,
    };
  }

  async componentDidMount() {
    try {
      //console.log(localStorage);
      // Nik: always use this.setState don't set the state directly
      //id aus url
      this.setState({
        ID_game: this.props.match.params.gameId,
      });

      this.setNumberState();

      //poll every 1 seconds all players, search game
      this.timer = setInterval(() => this.getGameStatus(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }
  async getGameStatus() {
    try {
      //if the game is not ready for the next page then we are waiting and ask for the state again
      if (!this.state.readyForNext) {
        //get the game and its status
        const get_game = await api.get(`/games/${this.state.ID_game}`);
        this.setState({
          game: get_game.data,
          game_status: get_game.data.status,
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
        this.props.history.push(`/game/${this.state.ID_game}/enterguess`);
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Nik:
    // gets called every time the component changes (also state changes)
    // you could also compare the prevState with the current state
    // and then save it if something changed
  }

  //change the number state
  changeNumberState(number) {
    this.setState(
      {
        chosen_number: number,
        readyToRender: false,
      },
      this.saveChange //Nik: pass a function as callback (gets executed AFTER state change)
    );
    this.saveChangeAlternative(number);
  }

  //change the number state with another method
  handleNumberClickAlternative(number) {
    this.setState({
      chosen_number: number,
      readyToRender: false,
    });
    this.saveChangeAlternative(number); //Nik: call the save function with the received number
  }

  //save the change and send the wordId chosen to the backend
  async saveChangeAlternative(number) {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        wordId: number - 1,
        token: localStorage.getItem("token"),
      });

      await api.post(`/games/${this.state.ID_game}/terms`, requestBody);

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
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }
  async allKnowTheWord() {
    try {
      //get all players in the game
      //set player and playerstatus
      const allPlayers = await api.get(`/games/${this.state.ID_game}/players`);
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
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  //change the number state with another method
  async handleNumberClick(number) {
    // Nik:
    // number is available here, so use it directly if you want to call the backend

    this.setState({ chosen_number: number });

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

  async exitGame() {
    /*
    if a player exits the lobby then:
    - change status to not ready
    - delete player from player list in game
    - redirect to dashboard
  
    */

    //change status to not ready
    this.setState({
      ID_game: null,
      game: null,
      game_status: null,
      chosen_number: [],
      readyToRender: true,
      readyForNext: false,
      hide1: false,
      hide2: false,
      hide3: false,
      hide4: false,
      hide5: false,
      rules: false,
    });
    //need time to change player status
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let requestBody;

      //delete player from player list in game
      requestBody = JSON.stringify({
        player: this.state.player,
      });
      // send request body to the backend
      console.log(requestBody);
      await api.delete(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );
      //change local storage
      localStorage.removeItem("status");
      localStorage.removeItem("gameId");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");

      clearInterval(this.timer);
      this.timer = null;
      this.props.history.push("/dashboard");
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  waitingSentence() {
    if (this.state.game_status === "VALIDATING_TERM") {
      return "the word is getting validated";
    } else if (this.state.game_status === "RECEIVING_HINTS") {
      return "the hints are getting sent";
    } else if (this.state.game_status === "VALIDATING_HINTS") {
      return "the hints are getting validated";
    } else {
      return "waiting";
    }
  }
  async waitingBar() {
    try {
      //get all players in the game
      //set player and playerstatus
      const allPlayers = await api.get(`/games/${this.state.ID_game}/players`);
      //-1 because of the guesser
      let amountPlayers = allPlayers.data.length - 1;
      const hints = await api.get(`/games/${this.state.ID_game}/hints`);

      let amountHints = amountPlayers ^ 2;
      console.log(allPlayers.data);
      let sum = 0;

      let percentage;
      for (let i = 0; i < allPlayers.data.length; i++) {
        if (allPlayers.data[i].status !== "GUESSER") {
          if (this.state.game_status === "VALIDATING_TERM") {
            console.log(allPlayers.data[i].playerTermStatus);
            if (allPlayers.data[i].playerTermStatus !== "NOT_SET") {
              sum++;
            }
            percentage = (sum / amountPlayers) * 100;
          } else if (this.state.game_status === "RECEIVING_HINTS") {
            if (hints.data[i]) {
              if (hints.data[i].content) {
                sum++;
              }
            }
            percentage = (sum / amountPlayers) * 100;
          } else if (this.state.game_status === "VALIDATING_HINTS") {
            if (hints.data[i]) {
              if (hints.data[i].reporters) {
                sum += hints.data[i].reporters.length;
              }
            }
            percentage = (sum / amountHints) * 100;
          }
        }
      }

      this.setState({
        progressBar: percentage,
      });
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Container fluid>
        {this.getGameStatus}
        {console.log("this is the game status")}
        {console.log(this.state.game_status)}
        {console.log(
          "checks if we are ready to render if we are not then spinner"
        )}
        {console.log(this.state.readyToRender)}
        <Row>
          {" "}
          <Col xs="5" md="2">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 5, offset: 2 }} md={{ span: 2, offset: 8 }}>
            <Row className="d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
                onClick={() => this.exitGame()}
              >
                Exit Game
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
