import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import Rules from "../rules/Rules";

const word = {
  fontSize: "7vw",
  textAlign: "center",
  color: "white",
};

const question = {
  fontSize: "3vw",
  textAlign: "center",
  opacity: 0.2,
};

const sentence = {
  fontSize: "2vw",
  textAlign: "center",
  opacity: 0.2,
};

const bigbutton = {
  //top right bottom left
  padding: "2vw 3vw 2vw 3vw",
  marginTop: 0,
  marginLeft: "10vw",
};

const progressbar = {
  width: "22vw",
};

class ReportWord extends React.Component {
  constructor() {
    super();

    this.state = {
      playerId: null,
      player: null,
      players: null,
      gameId: null,
      word: null,
      last_word: null,
      perCentPositive: null,
      perCentNegative: null,
      readyToGo: false,
      clicked: false,
      last_time: null,
      rules: false,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;

      console.log(this.state.playerId);
      //get current player
      const current_player = await api.get(
        `/games/players/${this.state.playerId}`
      );
      //get all_players
      const all_players = await api.get(`/games/${this.state.gameId}/players`);

      //get word
      let requestBody;

      requestBody = JSON.stringify({
        gameId: this.state.gameId,
      });

      const word = await api.get(
        `/games/${this.state.gameId}/terms`,
        requestBody
      );

      //setting the states: current_player & word
      this.setState({
        player: current_player.data,
        players: all_players.data,
        word: word.data.content,
      });

      this.timer = setInterval(() => this.getPlayerTermStatus(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while getting the word which has to be guessed: \n${handleError(
          error
        )}`
      );
    }
  }
  //get the word and set it to the internal state
  async getPlayerTermStatus() {
    try {
      //get word
      let requestBody;

      requestBody = JSON.stringify({
        gameId: this.state.gameId,
      });
      const word = await api.get(
        `/games/${this.state.gameId}/terms`,
        requestBody
      );
      this.setState(
        {
          word: word.data.content,
        },
        this.callback
      );
      console.log(this.state.word);
      //get all players
      const all_players = await api.get(`/games/${this.state.gameId}/players`);
      this.setState(
        {
          players: all_players.data,
        },
        this.calculatingBarNegative
        //this.calculatingBarPositive
      );
      //does the player clicked on the yes or no button
      this.setClicked();
      const get_game = await api.get(`/games/${this.state.gameId}`);
      //check if we are allowed to go on
      let stay;
      stay = this.stay(get_game);
      if (!stay) {
        //clear timer and push
        clearInterval(this.timer);
        this.timer = null;
        this.props.history.push(`/game/${this.state.gameId}/giveClue`);
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }
  //callback function check if its really needed
  callback() {
     "this is just for nothing";
  }
  setClicked() {
    //save last word and check with current word, if different then set state clicked to false and update last word
    if (this.state.last_word !== this.state.word) {
      this.setState({
        last_word: this.state.word,
        clicked: false,
      });
    }
  }

  //stay at the report word page until we are allowed to send hints
  stay(get_game) {
    let stay;
    if (get_game.data.status === "RECEIVING_HINTS") {
      stay = false;
    } else {
      stay = true;
    }
    return stay;
  }

  //when user clicked yes button, then change internal and external state
  //internal set clicked to true
  async yes() {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        playerTermStatus: "KNOWN",
      });
      await api.put(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
      this.setState({
        clicked: true,
      });
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  //when user clicked yes button, then change internal and external state
  //internal set clicked to true
  async no() {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        playerTermStatus: "UNKNOWN",
      });
      await api.put(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
      this.setState({
        clicked: true,
      });
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }
  //calculating the result for the progess bar
  calculatingBarNegative() {
    let count = 0;
    let number_of_players = this.state.players.length;
    for (let i = 0; i < number_of_players; i++) {
      if (this.state.players[i].playerTermStatus === "UNKNOWN") {
        count++;
      }
      this.setState({
        perCentNegative: (count / (number_of_players - 1)) * 100,
      });
    }
  }
  /*
  calculatingBarPositive() {
    {
      let count = 0;
      let number_of_players = this.state.players.length;

      for (let i = 0; i < number_of_players; i++) {
        if (this.state.players[i].playerTermStatus === "KNOWN") {
          count++;
        }
        this.setState({
          perCentPositive: (count / (number_of_players - 1)) * 100,
        });
      }
    }
  }
  */

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
          <div style={{ marginTop: "4vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for the word</p>
            </div>
          </div>
        ) : (
          <div>
            {console.log(this.state.word)}
            <Row>
              <Col>
                <div>
                  <p style={word}>{this.state.word.toString()}</p>
                </div>
              </Col>
            </Row>

            {!this.state.clicked ? (
              <div>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <p style={question}>Do you know the word?</p>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 3, offset: 4 }}
                    md={{ span: 0, offset: 0 }}
                  ></Col>
                  <Col xs="5" md="6">
                    <Button
                      variant="outline-success"
                      style={bigbutton}
                      disabled={this.state.pressed}
                      onClick={() => {
                        this.yes();
                      }}
                    >
                      <h2>YES</h2>
                    </Button>

                    <Button
                      variant="outline-danger"
                      style={bigbutton}
                      disabled={this.state.pressed}
                      onClick={() => {
                        this.no();
                      }}
                    >
                      <h2>NO</h2>
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              <div style={{ marginTop: "2vw" }}>
                <div class="row justify-content-center">
                  <Spinner />
                </div>
                <div class="row justify-content-center">
                  <p className="large-Font">waiting for the others</p>
                </div>
              </div>
            )}

            <Row style={{ marginTop: "3vw" }}>
              <Col>
                <p style={sentence}>Players that DON'T know the word</p>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center">
              <div>
                <ProgressBar
                  style={progressbar}
                  striped
                  variant="danger"
                  now={this.state.perCentNegative}
                />
              </div>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(ReportWord);
