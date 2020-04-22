import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";
import {progressbar} from 'react-bootstrap/ProgressBar';

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

class ReportWord extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: null,
      playerId: null,
      player: null,
      players: null,
      gameId: null,
      roundId: null,
      word: null,

      //playersReportedNo: 2,
      //noOfPlayers: 7,
      //barWidth: 40,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerToken = localStorage.getItem("token");
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;
      this.state.roundId = this.props.match.params.roundId;

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

      console.log(word.data)

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
      //get all players
      const all_players = await api.get(`/games/${this.state.gameId}/players`);
      this.setState(
        {
          players: all_players.data,
        },

        this.calculatingBar
      );
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }

  async yes() {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        playerTermStatus: "KNOWN",
      });
      const response = await api.put(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
      console.log(response);
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
      const response = await api.put(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  calculatingBar() {
    let count = 0;
    let number_of_players = this.state.players.length;
    for (let i = 0; i < number_of_players; i++) {
      if (this.state.players[i].playerTermStatus === "UNKNOWN") {
        count++;
      }
      return count / number_of_players;
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
          <Spinner />
        ) : (
          <div>
            <Row>
              <Col>
                <p style={word}>{this.state.word}</p>
              </Col>
            </Row>

            <Row>
              <Col>
                <p style={question}>Do you know the word?</p>
              </Col>
            </Row>

            <Row>
            <Col xs={{ span: 0, offset: 0 }} md={{ span:3, offset: 0 }}></Col>
              <Col xs="7" md="2">
                <Button
                  variant="outline-success"
                  style={bigbutton}
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
                  onClick={() => {
                    this.no();
                  }}
                >
                  <h2>NO</h2>
                </Button>
              </Col>
            </Row>

            <Row style={{ marginTop: "8vw" }}>
              <Col>
                <p style={sentence}>
                  Number of players that don't know the word
                </p>
              </Col>
            </Row>

            <Row>
              <div><progressbar striped variant="danger" now={30} /></div>
            
 
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(ReportWord);
