import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Rules from "../rules/Rules";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

class EnterGuess extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: localStorage.getItem("token"),
      playerId: localStorage.getItem("Id"),
      gameId: null,
      roundId: null,
      hints: null,
      guess: null,
      timer: null,
      readyToRender: null,
      noHintsValid: null,
      rules: false,
      endGame: false,
      timerGameEnded: null

    };
    this.getHints = this.getHints.bind(this);
  }

  async componentDidMount() {
    try {
      // set the states, if change to setState problems
      //this.state.playerToken = localStorage.getItem("token");
      //this.state.playerId = localStorage.getItem("Id");
      //this.state.gameId = this.props.match.params.gameId;
      this.setState({ gameId: this.props.match.params.gameId });
      // get all the given hints
      this.getHints();
      this.timer = setInterval(() => this.getHints(), 1000);
     
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
      console.log("game ended enterguess")
      const response = await api.get(`/games/${this.state.gameId}`);
      console.log("enterguess timer");
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


  async getHints() {
    try {
      if (this.state.gameId) {
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
        if (response.data.status === "RECEIVING_GUESS") {
          const response = await api.get(`/games/${this.state.gameId}/hints`);
          console.log(response.data);
          this.setState({ hints: response.data });
          clearInterval(this.timer);
          this.timer = null;
          this.setState({ readyToRender: true });
        }
      }
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the hints: \n${handleError(error)}`
      );
    }
  }

  async submit() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      else{
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;

        const requestBody = JSON.stringify({
          content: this.state.guess,
          token: this.state.playerToken,
        });
        // TODO: adapt url and request parameters
        await api.post(
          `/games/${this.state.gameId}/guesses`,
          requestBody
        );
        //is clearing the interval here okay?
        
        this.props.history.push(`/game/${this.state.gameId}/evalution`);


      }
      
      
    } catch (error) {
      this.timerGameEnded = setInterval(() => this.checkGameEnded(), 1100);
      alert(
        `Something went wrong while submitting the guess: \n${handleError(
          error
        )}`
      );
    }
  }

  async skip() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);
      if(response.data.status == "FINISHED"){
        clearInterval(this.timerGameEnded);
        this.timerGameEnded = null;
        this.props.history.push(`/game/${this.state.gameId}/Score`);
      }
      else{
      console.log(this.state.playerToken);
      const requestBody = JSON.stringify({
        token: this.state.playerToken,
      });
       await api.delete(`/games/${this.state.gameId}/guesses`, {
        data: requestBody,
      });
      clearInterval(this.timerGameEnded);
      this.timerGameEnded = null;
      this.props.history.push(`/game/${this.state.gameId}/evalution`);
    }
    } catch (error) {
      alert(`Something went wrong while skipping: \n${handleError(error)}`);
    }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
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
  //creats a table containning all VALID Hints
  createTable = () => {
    let table = [];
    let oneValid = 0;

    this.state.hints.forEach((hint) => {
      if (hint.status == "VALID") {
        oneValid = 1;
        table.push(
          <tr class="text-white" class="text-center">
            &bull;{hint.content}
          </tr>
        );
      }
    });
    if (oneValid == 0) {
      table.push(
        <tr class="text-white" class="text-center" style={{ color: "red" }}>
          All given hints are invalid
        </tr>
      );
    }
    return table;
  };

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
        {!this.state.readyToRender ? (
          <div>
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
              <p className="large-Font">Waiting for the hints</p>
            </div>
          </div>
        ) : (
          <div>
            <Row className="hints-table">
              <Col
                xs={{ span: 10, offset: 1 }}
                md={{ span: 6, offset: 3 }}
                lg={{ span: 4, offset: 4 }}
              >
                <Table bordered size="sm" className="font-medium">
                  <thead class="text-white">
                    <tr>
                      <th
                        class="text-center"
                        style={{
                          fontSize: "calc(1em + 0.8vw)",
                          color: "white",
                        }}
                      >
                        hints
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-white" className="font-medium">
                    {this.createTable()}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div class="row justify-content-center">
              <p className></p>
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
                placeholder="Enter your guess here "
                onChange={(e) => {
                  this.handleInputChange("guess", e.target.value);
                }}
              />
            </div>

            <div class="row justify-content-center">
              <Button
                variant="outline-light"
                className="outlineWhite-Guess"
                size="lg"
                disabled={!this.state.guess}
                onClick={() => {
                  this.submit();
                }}
              >
                Submit
              </Button>
            </div>

            <div class="row justify-content-center">
              <Button
                variant="outline-light"
                className="outlineWhite-Guess"
                size="lg"
                onClick={() => {
                  this.skip();
                }}
              >
                Skip
              </Button>
            </div>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(EnterGuess);
