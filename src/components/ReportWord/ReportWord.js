import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";

class ReportWord extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: null,
      playerId: null,
      gameId: null,
      roundId: null,

      hints: ["yellow", "hot", "shine", "light"],
      //hints: [],
      guess: null,
    };
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerToken = localStorage.getItem("token");
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;
      this.state.roundId = this.props.match.params.roundId;

      // get all the given hints
      // TODO: adapt the url
      const response = await api.get(
        `/games/${this.state.gameId}/rounds/${this.state.roundId}/actions`
      );
      console.log(response);
      this.setState({ hints: response });
    } catch (error) {
      alert(
        `Something went wrong while loading the player's hints: \n${handleError(
          error
        )}`
      );
    }
  }

  render() {
    return (
      <div>
        <Container fluid>
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
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                >
                  Rules
                </Button>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(ReportWord);
