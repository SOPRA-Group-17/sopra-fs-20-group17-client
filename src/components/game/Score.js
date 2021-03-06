import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Rules from "../rules/Rules";
import logo from "../styling/JustOne_logo_white.svg";

const sentence = {
  fontSize: "4vw",
};

class Score extends React.Component {
  constructor() {
    super();
    this.state = {
      gameId: null,
      playerId: null,
      player: null,
      status: null,
      game: null,
      players: null,
      rules: false,
      endedNormal: true,
    };
  }

  async componentDidMount() {
    try {
      //id aus url
      this.state.gameId = this.props.match.params.gameId;

      //player id aus local storage, set in dahboard
      this.state.playerId = localStorage.getItem("Id");

      //current player
      //set player and playerstatus
      const current_player = await api.get(
        `/games/players/${this.state.playerId}`
      );

      //get all players sorted descendend
      const all_players = await api.get(
        `/games/${this.state.gameId}/players?sort_by=score.desc`
      );

      //get the game and its status
      const get_game = await api.get(`/games/${this.state.gameId}`);

      /*
            set and update state of:
            - all players
            - current player
            - the status from the current player
  
      */
      this.setState({
        players: all_players.data,
        player: current_player.data,
        status: current_player.data.status,
        game: get_game.data,
      });

      //check if the game has ended normal, if not then show a modal with this information
      if (localStorage.getItem("endedNormal")) {
        this.setState({
          endedNormal: true,
        });
      } else {
        this.setState({
          endedNormal: false,
        });
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the players or getting the game: \n${handleError(
          error
        )}`
      );
    }
  }

  //create scoring table
  createTable() {
    let table = [];
    // Outer loop to create parent
    if (this.state.players) {
      for (let i = 0; i < this.state.players.length; i++) {
        let children = [];
        var best = 100;
        var middle = 50;
        
        //Inner loop to create children
        for (let j = 0; j < 3; j++) {
          if (j === 0) {
            children.push(<td>{i + 1}</td>);
          }
          if (j === 1) {
            children.push(<td>{this.state.players[i].name}</td>);
          }
          if (j === 2) {
            if (this.state.players[i].score >= best) {
              children.push(
                <td class="text-success">{this.state.players[i].score}</td>
              );
            } else if (
              this.state.players[i].score < best &&
              this.state.players[i].score >= middle
            ) {
              children.push(
                <td class="text-warning">{this.state.players[i].score}</td>
              );
            } else if (this.state.players[i].score < middle) {
              children.push(
                <td class="text-danger">{this.state.players[i].score}</td>
              );
            }
          }
        }
        table.push(<tr class="text-white">{children}</tr>);
      }
      //Create the parent and add the children
      return table;
    }
  }

  teamScore() {
    let sum = 0;
    if (this.state.players) {
      for (let i = 0; i < this.state.players.length; i++) {
        sum += this.state.players[i].score;
      }
    }
    return sum;
  }

  correctGuesses() {
    //shows amount of correct guesses
    //console.log(this.state.game);
    if (this.state.game) {
      if (this.state.game.correctCards >= 0) {
        return this.state.game.correctCards;
      } else {
        return 0;
      }
    }
  }

  async exitLobby() {
    /*
    if a user exits the lobby then:
    - delete player from player list in game
    - remove localStorage
    - redirect to dashboard
  
    */
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let requestBody;

      //delete player from player list in game
      requestBody = JSON.stringify({
        player: this.state.player,
      });
      // send request body to the backend
      //console.log(requestBody);
      await api.delete(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
      //change local storage
      localStorage.removeItem("status");
      localStorage.removeItem("gameId");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");

      this.props.history.push("/dashboard");
      //TODO: who is resetting the game state
    } catch (error) {
      alert(
        `Something went wrong while exiting the screen: \n${handleError(
          error
        )}`
      );
    }
  }
  async saveChangePlayerStatus() {
    try {
      let requestBody;

      //send in the request body the user and its current status
      requestBody = JSON.stringify({
        status: this.state.status,
      });

      // send request body to the backend
      await api.put(
        `/games/${this.state.gameId}/players/${this.state.playerId}`,
        requestBody
      );
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
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
            <Col xs={{ span: 1, offset: 0 }} md={{ span: 2, offset: 2 }}>
              <Row></Row>
            </Col>
            <Col xs={{ span: 6, offset: 0 }} md={{ span: 2, offset: 3 }}>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => this.exitLobby()}
                >
                  Back to Dashboard
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
            show={!this.state.endedNormal}
            onHide={() => this.setState({ endedNormal: true })}
            aria-labelledby="rules-dashboard"
          >
            <Modal.Header closeButton className="rules-header">
              <Modal.Title
                id="fast-dashboard-title"
                className="fast-ending-header"
              >
                Game finished
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="rules-text">

              <p className="rules-text">
                A player has ended the game. <br></br>

                Thanks for playing the game
              </p>
            </Modal.Body>
          </Modal>
          <Row>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 2, offset: 2 }}></Col>
            <Col xs="12" md="8">
              <p style={sentence}>Team Score: {this.teamScore()}</p>

              <p style={sentence}>
                Nr. of correct guesses: {this.correctGuesses()}{" "}
              </p>
            </Col>
          </Row>
          <Row style={{ marginTop: "5vw" }}>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 2, offset: 2 }}></Col>
            <Col xs="7" md="3">
              <Table striped bordered hover size="sm">
                <thead class="text-white">
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>score</th>
                  </tr>
                </thead>
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Score);
