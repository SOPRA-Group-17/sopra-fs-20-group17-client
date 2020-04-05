import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Player from "../shared/models/Player";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import game from "../shared/models/Game";

const lobbyname = {
  fontSize: "4vw",
  textAlign: "center",
  marginTop: "2vw",
};

const bigbutton = {
  width: "22vw",
  height: "8vw",
};

class Lobby extends React.Component {
  constructor() {
    super();
    var player1 = new Player();
    player1.id = "1";
    player1.username = "test1";
    player1.token = null;
    player1.status = false;
    player1.game = null;

    var player2 = new Player();
    player2.id = "2";
    player2.username = "test2";
    player2.token = null;
    player2.status = false;
    player2.game = null;

    var player3 = new Player();
    player3.id = "3";
    player3.username = "test3";
    player3.token = null;
    player3.status = false;
    player3.game = null;
    this.state = {
      game: new game(),
      player: new Player(),
      players: [player1, player2, player3],
      ID_game: null,
      ID_player: null,
      status: false,
    };

    this.changeStatusState = this.changeStatusState.bind(this);
  }

  //returns all Players

  async componentDidMount() {
    try {
      //id aus url
      this.state.ID_game = this.props.match.params.id;
      //TODO was bekommen wir genau zurück, Annahme: Players liste
      const response = await api.get(`/games/${this.state.ID}/players`);
      this.setState({ players: response.data });

      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the returned game and update the state.
      // TODO in game there has to be the same fields as in the backend game class
      console.log(this.players);
      console.log(this.players[0].status);
      console.log(this.response.data);
      //unklar ob noch benötigt
      /*
      for (var i=0; i<response.length; i++){
        this.setState({ Player: response.data[i]});
        console.log(this.state.ID);
      } */
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  changeStatusState() {
    this.setState((state) => ({
      status: !this.state.status,
      //TODO put request to change status state of this player
    }));
  }

  render() {
    return (
      <div>
        {console.log(this.state.players[0].username)}
        <Container fluid>
          <Row>
            <Col xs="5" md="3">
              <img
                className="logoImgSmall"
                src={logo}
                alt="Just One Logo"
              ></img>
            </Col>
            <Col xs={{ span: 3, offset: 0 }} md={{ span: 2, offset: 3 }}>
              <Row>
                <p style={lobbyname}>LOBBYNAME</p>
              </Row>
            </Col>
            <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 2 }}>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                >
                  Exit Lobby
                </Button>
              </Row>
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

          <Row style={{ marginTop: "4vw" }}>
            <Col xs={{ span: 0, offset: 0 }} md={{ span: 2, offset: 0 }}></Col>
            <Col xs="7" md="3">
              <Table striped bordered hover size="sm">
                <thead class="text-white">
                  <tr>
                    <th>#</th>
                    <th>username</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody class="text-white">
                  <tr class="text-white">
                    <td>1</td>
                    <td>heino</td>
                    <td class="text-danger">not status</td>
                  </tr>
                  <tr class="text-white">
                    <td>2</td>
                    <td>maria</td>
                    <td class="text-success">status</td>
                  </tr>
                  <tr class="text-white">
                    <td>3</td>
                    <td>pflanze3</td>
                    <td class="text-danger">not status</td>
                  </tr>
                  <tr class="text-white">
                    <td>4</td>
                    <td>kugelschreiber</td>
                    <td class="text-danger">not status</td>
                  </tr>
                  <tr class="text-white">
                    <td>5</td>
                    <td>helmut</td>
                    <td class="text-success">status</td>
                  </tr>
                  <tr class="text-white">
                    <td>6</td>
                    <td>boxinator</td>
                    <td class="text-danger">not status</td>
                  </tr>
                  <tr class="text-white">
                    <td>7</td>
                    <td>eiermensch</td>
                    <td class="text-success">not status</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={{ span: 2, offset: 3 }} md={{ span: 2, offset: 2 }}>
              {console.log(this.state.status)}
              {this.state.status ? (
                <div>
                  <button
                    class="btn btn-outline-success"
                    style={bigbutton}
                    onClick={this.changeStatusState}
                  >
                    <h1>ready</h1>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={this.changeStatusState}
                    class="btn btn-outline-danger"
                    style={bigbutton}
                  >
                    <h1> Not ready</h1>
                  </button>
                </div>
              )}
              {console.log(this.state.status)}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Lobby);
