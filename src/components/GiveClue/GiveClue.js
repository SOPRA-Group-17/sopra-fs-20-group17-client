import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
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
      token: localStorage.getItem("token"),
      timer: null,
      rules: false,
      id: localStorage.getItem("Id"),
      endGame: false,
      timerGameEnded: null

    };
  }

  async componentDidMount() {
    try {
      this.setState({ gameId: this.props.match.params.gameId });
      //this.state.id = localStorage.getItem("Id");
      //this.state.token = localStorage.getItem("token");

      this.checkTermAvailible();
      this.timer = setInterval(() => this.checkTermAvailible(), 1000);
      
      this.timerGameEnded = setInterval(() => this.checkGameEnded(), 1100);
    } catch (error) {
      alert(
        `Something went wrong while setting up the page: \n${handleError(
          error
        )}`
      );
    }
  }

  async checkGameEnded() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      
    } catch (error) {
      alert(
        `Something went wrong while checking if the game has ended: \n${handleError(error)}`
      );
    }
  }

  

  //checks if state of game receiving_Hints, if yes it calls getTerm which gets the term of the round
  async checkTermAvailible() {
    try {
      if(this.state.gameId){
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timer);
        this.timer = null;
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      else{
        const response = await api.get(`/games/${this.state.gameId}`);
        // check if game ready to give hints
        console.log(response.data.status);
        if (response.data.status === "RECEIVING_HINTS") {
          clearInterval(this.timer);
          this.timer = null;
          this.getTerme();
        }
      }
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
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      else{
      const response = await api.get(`/games/${this.state.gameId}/terms`);

      // Get the returned terme and update the state.
      this.setState({ word: response.data.content });
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }

  async submitClue() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      else{
      const requestBody = JSON.stringify({
        content: this.state.clue,
        token: this.state.token,
      });
      
      await api.post(
        `/games/${this.state.gameId}/hints`,
        requestBody
      );
      clearInterval(this.timerGameEnded);
      this.timerGameEnded = null;
      this.props.history.push(`/game/${this.state.gameId}/validation`);
      }
    } catch (error) {
      alert(
        `Something went wrong while submiting the clue \n${handleError(error)}`
      );
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  async endGame() {
    try{
      const requestBody = JSON.stringify({
        status: "FINISHED"
      });
      await api.put(`/games/${this.state.gameId}`, requestBody);
      clearInterval(this.timer);
      this.timer = null;
      clearInterval(this.timerGameEnded);
      this.timerGameEnded = null;
      this.props.history.push(`/game/${this.state.gameId}/Score`);
    }
    catch (error) {
    alert(
      `Something went wrong while trying to end the game: \n${handleError(
        error
      )}`
    );
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
                onClick={() => this.setState({ rules: true })}
              >
                Rules
              </Button>
              </Row>
              <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-danger"
                    className="outlineWhite-Dashboard"
                    onClick={() => this.setState({ endGame: true })}
                  >
                    End Game
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
