import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Rules from "../rules/Rules";

import {
  Container,
  Row,
  Col,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

const progressbar = {
  width: "22vw",
};

class Validation extends React.Component {
  constructor() {
    super();

    this.state = {
      word: null,
      gameId: null,
      hints: [],
      hintsReport: [],
      nr: 2,
      token: localStorage.getItem("token"),
      similar: true,
      invalid: [],
      readyToRender: null,
      successfull: 0,
      help: false,
      rules: false,
      progressBar: null,
      endGame: false,
      timerGameEnded: null,
    };

    this.creatReportHintArray = this.creatReportHintArray.bind(this);
    this.reportSimilar = this.reportSimilar.bind(this);
    this.unReportSimilar = this.unReportSimilar.bind(this);
  }

  async componentDidMount() {
    try {
      //this.state.token = localStorage.getItem("token");
      this.state.gameId = this.props.match.params.gameId;
      this.setState({ gameId: this.props.match.params.gameId });

      const response = await api.get(`/games/${this.state.gameId}`);

      if (response.data.status === "FINISHED") {
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      } else {
        const response = await api.get(
          `/games/${this.props.match.params.gameId}/terms`
        );

        //check if user was on this site before, in same game
        if (localStorage.getItem("sawHelp") != null) {
          if (localStorage.getItem("sawHelp") === 0) {
            localStorage.setItem("sawHelp", 1);
            this.setState({ help: true });
          }
        }

        // Get the returned terme and update the state.
        this.setState({ word: response.data.content });

        this.getHints();

        this.timer = setInterval(() => this.getHints(), 1000);

        this.timerGameEnded = setInterval(() => this.checkGameEnded(), 1100);
      }
    } catch (error) {
      alert(
        `Something went wrong while setting up the page and getting the term: \n${handleError(
          error
        )}`
      );
    }
  }

  async checkGameEnded() {
    try {
      //console.log("validation timer");
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

  async getHints() {
    try {
      if (this.state.gameId) {
        const response = await api.get(`/games/${this.state.gameId}`);

        // check if game ready to give hints
        if (response.data.status === "FINISHED") {
          clearInterval(this.timer);
          this.timer = null;
          clearInterval(this.timerGameEnded);
          this.timerGameEnded = null;
          this.props.history.push(`/game/${this.state.gameId}/Score`);
        } else if (response.data.status === "VALIDATING_HINTS") {
          const response2 = await api.get(`/games/${this.state.gameId}/hints`);
          //console.log(response2.data);
          clearInterval(this.timer);
          this.timer = null;
          this.setState({ hints: response2.data }, () =>
            this.creatReportHintArray()
          );
        }
        this.waitingBar();
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the hints: \n${handleError(error)}`
      );
    }
  }

  creatReportHintArray() {
    //console.log(this.state.hints);
    this.state.hints.forEach((hint) => {
      let marked = "VALID";
      if (hint.status === "INVALID") {
        marked = "INVALID";
      }
      this.state.hintsReport.push({
        content: hint.content,
        token: hint.token,
        marked: marked,
        similarity: hint.similarity,
        reporters: [],
      });
    });
    //console.log(this.state.hintsReport);
    this.setState({ readyToRender: true });
  }

  submitReport() {
    let listRequestBody = [];

    this.state.hintsReport.forEach((hint) => {
      const requestBody = JSON.stringify({
        token: hint.token,
        marked: hint.marked,
        similarity: hint.similarity,
        reporters: [this.state.token],
      });
      listRequestBody.push(requestBody);
    });

    this.submitReportPut(listRequestBody);
  }

  async submitReportPut(listRequestBody) {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if (response.data.status === "FINISHED") {
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      } else {
        for (let i = 0; i < this.state.hintsReport.length; i++) {
          let requestBody = listRequestBody[i];
          await api.put(`/games/${this.state.gameId}/hints`, requestBody);
        }
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/evalution`);
      }
    } catch (error) {
      alert(
        `Something went wrong while submiting your reports \n${handleError(
          error
        )}`
      );
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
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
      this.props.history.push(`/game/${this.state.gameId}/Score`);
    } catch (error) {
      alert(
        `Something went wrong while trying to end the game: \n${handleError(
          error
        )}`
      );
    }
  }

  //nr is the nr of card = array index +1
  //x is the nr of hints
  creatButton(x, nr) {
    let Buttons = [];

    for (let i = 1; i <= x; i++) {
      if (nr !== i) {
        Buttons.push(
          <ToggleButton
            variant="outline-light"
            value={i - 1}
            onClick={(e) => {
              if (this.state.hintsReport[nr - 1].similarity.includes(i - 1)) {
                //console.log("unreport get called to");
                this.unReportSimilar(nr - 1, i - 1);
                e.preventDefault();
              } else {
                this.reportSimilar(nr - 1, i - 1);
                e.preventDefault();
              }
            }}
          >
            {i}
          </ToggleButton>
        );
      }
    }
    return Buttons;
  }

  unReportSimilar(index1, index2) {
    //deleting similarity index1
    let similar1 = this.state.hintsReport[index1].similarity;
    if (similar1.includes(index2)) {
      let newArray1 = this.state.hintsReport;
      for (var i = 0; i < similar1.length; i++) {
        if (similar1[i] === index2) {
          similar1.splice(i, 1);
        }
        newArray1[index1] = { ...newArray1[index1], similarity: similar1 };
        this.setState({ hintsReport: newArray1 });
      }
    }

    //deleting similarity index2
    let similar2 = this.state.hintsReport[index2].similarity;
    if (similar2.includes(index1)) {
      let newArray2 = this.state.hintsReport;
      for (i = 0; i < similar2.length; i++) {
        if (similar2[i] === index1) {
          similar2.splice(i, 1);
        }
        newArray2[index2] = { ...newArray2[index2], similarity: similar2 };
        this.setState({ hintsReport: newArray2 });
      }
    }

    //console.log(this.state.hintsReport);
  }

  reportSimilar(index1, index2) {
    //updating similarity index1
    let similar1 = this.state.hintsReport[index1].similarity;
    if (!similar1.includes(index2)) {
      let newArray1 = this.state.hintsReport;
      similar1.push(index2);

      newArray1[index1] = { ...newArray1[index1], similarity: similar1 };
      this.setState({ hintsReport: newArray1 });
    }
    //updating similarity index2
    let similar2 = this.state.hintsReport[index2].similarity;
    if (!similar2.includes(index1)) {
      let newArray2 = this.state.hintsReport;
      similar2.push(index1);

      newArray2[index2] = { ...newArray2[index2], similarity: similar2 };
      this.setState({ hintsReport: newArray2 });
    }
    //console.log(this.state.hintsReport);
  }

  //creats a card for each hint
  createCards = () => {
    let cards = [];
    let totalNr = this.state.hintsReport.length;

    this.state.hintsReport.forEach((hint, index) => {
      cards.push(
        <Col
          style={{ border: "calc(0.025em + 0.025vw) solid white" }}
          key={hint.token}
        >
          <div>
            <div class="row justify-content-center">
              <p className="nr">{index + 1}</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">{hint.content}</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is too similar to:</p>
            </div>
            <div class="row justify-content-center">
              <ToggleButtonGroup
                key={index - 1}
                type="checkbox"
                value={this.state.hintsReport[index].similarity}
                className="mb-2"
                variant="outline-danger"
              >
                {this.creatButton(totalNr, index + 1)}
              </ToggleButtonGroup>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is </p>
            </div>
            <div class="row justify-content-center">
              {hint.marked === "VALID" ? (
                <Button
                  size="md"
                  variant="outline-success"
                  className="button-card"
                  style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
                  onClick={() => {
                    let newArray = this.state.hintsReport;
                    newArray[index] = { ...newArray[index], marked: "INVALID" };
                    //console.log(newArray);
                    this.setState({ hintsReport: newArray });
                    //console.log(this.state.hintsReport);
                  }}
                >
                  VALID
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="outline-danger"
                  className="button-card"
                  style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
                  onClick={() => {
                    let newArray = this.state.hintsReport;
                    newArray[index] = { ...newArray[index], marked: "VALID" };
                    //console.log(newArray);
                    this.setState({ hintsReport: newArray });
                    //console.log(this.state.hintsReport);
                  }}
                >
                  INVALID
                </Button>
              )}
            </div>
          </div>
        </Col>
      );
    });

    return cards;
  };

  async waitingBar() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if (response.data.status === "FINISHED") {
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      } else {
        //get all players in the game
        //set player and playerstatus
        const allPlayers = await api.get(`/games/${this.state.gameId}/players`);
        //console.log(allPlayers.data);
        //-1 because of the guesser
        let amountPlayers = allPlayers.data.length - 1;
        //console.log(amountPlayers);
        //get all hints to check afterwards
        const hints = await api.get(`/games/${this.state.gameId}/hints`);

        //get the game to check the game state
        const gameStatus = await api.get(`/games/${this.state.gameId}`);

        let sum = 0;

        let percentage;
        if (gameStatus.data.status === "RECEIVING_HINTS") {
          sum = hints.data.length;
          percentage = (sum / amountPlayers) * 100;
        }
        this.setState({
          progressBar: percentage,
        });
      }
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Container fluid>
        {!this.state.readyToRender ? (
          <div>
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
                    size="lg"
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
                <Modal.Title
                  id="rules-dashboard-title"
                  className="rules-header"
                >
                  End Game
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="rules-text">
                <p className="rules-text">
                  Are you sure that you want to end the game? This will end the
                  game for all players.
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

            <div
              class="row justify-content-center"
              style={{ marginTop: "5vw" }}
            >
              <Spinner />
            </div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "2vw" }}
            >
              <p className="large-Font">Waiting for the other clues</p>
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
              <Col xs="4" md="2">
                <img className="logoImgXS" src={logo} alt="Just One Logo"></img>
              </Col>
              <Col xs={{ span: 4, offset: 0 }} md={{ span: 4, offset: 2 }}>
                <div
                  class="row justify-content-center"
                  style={{ marginTop: "1vw" }}
                >
                  <p className="large-Font">{this.state.word}</p>
                </div>
              </Col>
              <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 2 }}>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-danger"
                    className="outlineWhite-Validation"
                    onClick={() => this.setState({ endGame: true })}
                  >
                    End Game
                  </Button>
                </Row>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Validation"
                    size="md"
                    onClick={() => this.setState({ rules: true })}
                  >
                    Rules
                  </Button>
                </Row>

                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Validation"
                    onClick={() => this.setState({ help: true })}
                  >
                    Help
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
              show={this.state.help}
              onHide={() => this.setState({ help: false })}
              aria-labelledby="help-validation"
            >
              <Modal.Header closeButton className="rules-header">
                <Modal.Title
                  id="rules-dashboard-title"
                  className="rules-header"
                >
                  How to validate
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="rules-text">
                <p className="rules-text-s-title">Report similar</p>
                <p className="rules-text">
                  The number of a clue is written on the top of the Clue card. If
                  a clue is too similar to another clue, click on the number
                  of the similar clue in the number list. E.g. If Clue Nr.1 is
                  similar to clue Nr. 2. Click on 2 in the numberlist of clue Nr.1
                  1.
                </p>

                <p className="rules-text-s-title">Decide if valid or invalid</p>
                <p className="rules-text">
                  If you want to mark a clue as invalid click on the VALID
                  button after clicking the button the clue is marked as
                  INVALID.
                  <br />
                  To change the clue back to Valid click on the INVALID button
                  after clicking the button the clue is marked as VALID.
                </p>
                <p className="rules-text">
                  Invalid clues:
                  <ul>
                    <li>
                      The Mystery word but written differently. Example: Shurt
                      is not allowed when trying to make the player guess Shirt.
                    </li>
                    <li>
                      The Mystery word written in a foreign language. Example:
                      Buisson is not allowed if the word to be guessed is Shrub.
                    </li>
                    <li>
                      A word from the same family as the Mystery word. Example:
                      Princess is not allowed if the word to be guessed is
                      Prince
                    </li>
                    <li>
                      An invented word. Example: Swee’ting is not allowed to try
                      to help someone guess Cake.
                    </li>
                    <li>
                      A word phonetically identical to the Mystery word, but the
                      meaning of which is different. Example: Whether is not
                      allowed to try to get someone to guess Weather.
                    </li>
                  </ul>
                </p>
              </Modal.Body>
            </Modal>
            <Modal
              size="lg"
              show={this.state.endGame}
              onHide={() => this.setState({ endGame: false })}
              aria-labelledby="rules-dashboard"
            >
              <Modal.Header closeButton className="rules-header">
                <Modal.Title
                  id="rules-dashboard-title"
                  className="rules-header"
                >
                  End Game
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="rules-text">
                <p className="rules-text">
                  Are you sure that you want to end the game? This will end the
                  game for all players.
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

            <div
              class="row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center "
              style={{
                marginLeft: "calc(3em + 1vw)",
                marginRight: "calc(3em + 1vw)",
              }}
            >
              {this.createCards()}
            </div>

            <div class="row justify-content-center">
              <Button
                disabled={!this.state.readyToRender}
                variant="outline-danger"
                size="lg"
                className="outlineWhite-Dashboard"
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  this.submitReport();
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

export default withRouter(Validation);
