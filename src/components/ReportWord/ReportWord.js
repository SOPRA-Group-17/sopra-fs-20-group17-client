import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

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

class ReportWord extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: null,
      playerId: null,
      gameId: null,
      roundId: null,
      word: "sun",

      playersReportedNo: 2,
      noOfPlayers: 7,
      barWidth: 40,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerToken = localStorage.getItem("token");
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;
      this.state.roundId = this.props.match.params.roundId;

      // get the term which has to be guessed
      /*
      const response = await api.get(`/games/${this.state.gameId}/terms`);
      console.log(response);
      this.setState({ word: response });*/
    } catch (error) {
      alert(
        `Something went wrong while getting the word which has to be guessed: \n${handleError(
          error
        )}`
      );
    }
  }

  async yes() {
    try {
      // is this api correct???
      const response = await api.post(`/games/${this.state.gameId}/hints`);
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
    }
  }

  async no() {
    try {
      // is this api correct?
      const response = await api.delete(`/games/${this.state.gameId}/hints`);
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while reporting: \n${handleError(error)}`);
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
              <Col>
                <Button
                  variant="outline-success"
                  className="outlineWhite-Dashboard"
                  onClick={() => {
                    this.yes();
                  }}
                >
                  Yes
                </Button>
              </Col>

              <Col>
                <Button
                  variant="outline-danger"
                  className="outlineWhite-Dashboard"
                  onClick={() => {
                    this.no();
                  }}
                >
                  No
                </Button>
              </Col>
            </Row>

            <Row>
              <Col>
                <p style={sentence}>
                  Number of players that don't know the word
                </p>
              </Col>
            </Row>

            <Row>
              <div class="progress">
                <div class="progress-bar" style={{ width: "100em" }}></div>
              </div>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(ReportWord);
