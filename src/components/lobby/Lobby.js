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
  padding: "2vw 3vw 2vw 3vw",
  //top right bottom left
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
    player3.status = true;
    player3.game = null;

    var player4 = new Player();
    player4.id = "4";
    player4.username = "test4";
    player4.token = null;
    player4.status = true;
    player4.game = null;

    var game1 = new game();
    game1.name = "testname";

    this.state = {
      game: new game(),
      player: new Player(),
      players: [player1, player3],
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
      this.state.ID_game = this.props.match.params.gameId;
      this.state.ID_player = this.props.match.params.userId;
      console.log(this.state.ID_game);
      console.log(this.state.ID_player);

      //TODO was bekommen wir genau zurück, Annahme: Players liste
      /*
      const response = await api.get(`/games/${this.state.ID_game}/players`);
      console.log(response);
      this.setState({ players: response.data });*/
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      const response1 = await api.get(`/games/${this.state.ID_game}`);
      console.log("komme ich bis hier?");
      console.log(response1);
      this.setState({ game: response1.data });

      //TODO: player_id has to get the correct id

      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)

      // Get the returned game and update the state.
      // TODO in game there has to be the same fields as in the backend game class
      console.log(this.state.players);
      console.log(this.state.players[0].status);
      //console.log(this.response.data);
      console.log(this.state.players[0].username);
      //console.log(this.response.data);
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
    }));
    this.saveChange();
  }

  async saveChange() {
    try {
      var arraynumber = null;
      for (var i = 0; i < this.state.players.length; i++) {
        if (this.state.players[i].id === this.state.ID_player) {
          arraynumber = i;
        }
      }
      let requestBody;

      requestBody = JSON.stringify({
        id: this.state.ID_player,
        status: this.state.status,
      });

      console.log(requestBody);
      const response = await api.put(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );

      // Get the returned Player and update a new object.
      new Player(response.data);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  createTable = () => {
    let table = [];

    // Outer loop to create parent
    for (let i = 0; i < this.state.players.length; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        if (j === 0) {
          children.push(<td>{i + 1}</td>);
        }
        if (j === 1) {
          children.push(<td>{this.state.players[i].username}</td>);
        }

        if (j === 2) {
          if (this.state.players[i].status) {
            children.push(<td class="text-success">{`ready`}</td>);
          } else {
            children.push(<td class="text-danger">{`not ready`}</td>);
          }
        }
      }
      table.push(<tr class="text-white">{children}</tr>);
    }
    //Create the parent and add the children

    return table;
  };

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
                <p style={lobbyname}>{this.state.game.name}</p>
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
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
            <Col xs={{ span: 3, offset: 2 }} md={{ span: 3, offset: 1 }}>
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
