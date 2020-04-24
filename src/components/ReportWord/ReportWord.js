import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";

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
      perCentPositive: null,
      perCentNegative: null,
      readyToGo: false,
      clicked: true,
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

  async getPlayerTermStatus() {
    try {
      //get the word if its not here allready
      if (!this.state.word) {
        //get word
        let requestBody;

        requestBody = JSON.stringify({
          gameId: this.state.gameId,
        });
        const word = await api.get(
          `/games/${this.state.gameId}/terms`,
          requestBody
        );
        this.setState({
          word: word.data,
        });
      }
      console.log(this.state.word);
      //get all players
      const all_players = await api.get(`/games/${this.state.gameId}/players`);
      this.setState(
        {
          players: all_players.data,
        },

        this.calculatingBarPositive
      );
      this.calculatingBarNegative();
      const get_game = await api.get(`/games/${this.state.gameId}`);
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

  stay(get_game) {
    let stay;
    if (get_game.data.status === "RECEIVING_HINTS") {
      stay = false;
    } else {
      stay = true;
    }
    console.log(stay);
    return stay;
  }

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
              >
                Rules
              </Button>
            </Row>
          </Col>
        </Row>

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
            <Row>
              <Col>
                <p style={word}>{this.state.word}</p>
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
                    xs={{ span: 0, offset: 0 }}
                    md={{ span: 3, offset: 0 }}
                  ></Col>
                  <Col xs="7" md="2">
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
                  </Col>

                  <Col Col xs="7" md="2">
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
              <p className="large-Font">
                waiting for the others
              </p>
            </div>
          </div>
              
            )}

            <Row style={{ marginTop: "3vw" }}>
              <Col>
                <p style={sentence}>
                  Number of players that DON'T know the word
                </p>
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
            <Row
              className="d-flex justify-content-center"
              style={{ marginTop: "1vw" }}
            >
              <p style={sentence}>Number of players that DO know the word</p>
            </Row>
            <Row className="d-flex justify-content-center">
              <div>
                <ProgressBar
                  style={progressbar}
                  striped
                  variant="success"
                  now={this.state.perCentPositive}
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
