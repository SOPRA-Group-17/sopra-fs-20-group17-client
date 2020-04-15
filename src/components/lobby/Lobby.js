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
  marginTop: "2vw"
};

const bigbutton = {
  padding: "2vw 3vw 2vw 3vw",
  marginTop: 0,
  marginLeft: "10vw",
  //top right bottom left
};

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      game: new game(),
      game_status: null,
      player: new Player(),
      players: [],
      ID_game: null,
      ID_player: null,
      status: null,
      help_status: null
    };

    this.changeStatusState = this.changeStatusState.bind(this);
  }

  //returns all Players

  async componentDidMount() {
    try {
      //id aus url
      this.state.ID_game = this.props.match.params.gameId;
      this.state.ID_player = localStorage.getItem('Id');
      console.log(this.state.ID_game);
      console.log(this.state.ID_player);

      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      //await new Promise((resolve) => setTimeout(resolve, 15000));

      //set player and playerstatus
      const response = await api.get(`/games/players/${this.state.ID_player}`);
      console.log(response);
      this.setState({ player: response.data });
      this.setState({ status: this.state.player.status });
      if (this.state.status === "READY") {
        this.setState({ help_status: true });
        console.log(this.state.help_status);
      } else {
        this.setState({ help_status: false });
      }
      console.log(this.state.status);

      //poll every 1 seconds all players, search game
      this.timer = setInterval(() => this.getStatus(), 4000);
      //this.getStatus();
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async getStatus() {
    try {
      //get Players and set their status
      const response = await api.get(`/games/${this.state.ID_game}/players`);
      console.log(response);
      this.setState({ players: response.data });
      console.log(this.state.players);

      //get the game and its status
      const response1 = await api.get(`/games/${this.state.ID_game}`);
      console.log(response1);
      //console.log(response1.data.status);
      this.setState({ game: response1.data });
      this.setState(
        {
           game_status: response1.data.status,
           },
           this.startGame);
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }
  changeStatusState() {
    if (this.state.help_status === true) {
      this.setState({ status: "NOT_READY" });
      this.setState({ help_status: false });
    } else {
      this.setState({ status: "READY" });
      this.setState({ help_status: true });
    }

    this.saveChangePlayerStatus();
  }

  async saveChangePlayerStatus() {
    try {
      let requestBody;
      /*
        send this needed because:
        status change is made after new rendering, but the function is called before rerendering
        this is why we have to send the opposite (the state is not updated yet)
      */
      var send_this;
      if (this.state.status === "READY") {
        send_this = "NOT_READY";
      } else {
        send_this = "READY";
      }
      requestBody = JSON.stringify({
        status: send_this
      });
      console.log("aaaaaaaaaaaaaaaaaaaaaa");
      console.log(requestBody);
      const response = await api.put(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );

      console.log(response);
      // Get the returned Player and update a new object. do we need this?
      new Player(response.data);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  createTable() {
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
          children.push(<td>{this.state.players[i].name}</td>);
        }

        if (j === 2) {
          console.log(this.state.players[i].status);
          console.log(this.state.players);
          if (this.state.players[i].status === "READY") {
            children.push(<td class="text-success">{`ready`}</td>);
          } else if (this.state.players[i].status === "NOT_READY") {
            children.push(<td class="text-danger">{`not ready`}</td>);
          } else {
            children.push(
              <td class="text-white">
                {this.state.players[i].status.toString()}
              </td>
            );
          }
        }
      }
      table.push(<tr class="text-white">{children}</tr>);
    }
    //Create the parent and add the children

    return table;
  }

  startGame() {
    //gehe durch alle player, wenn mehr als 2 und weniger als 8
    // und alle ready,
    // dann ändere Game status und rendere neue seite
    console.log(this.state.game.status);
    if (this.state.game_status === "RECEIVINGTERM") {
      this.props.history.push("/number");
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
            <Col xs={{ span: 3, offset: 0 }} md={{ span: 2, offset: 2}}>
              <Row>
                <p style={lobbyname}>{this.state.game.name}</p>
              </Row>
            </Col>
            <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 3 }}>
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
                    <th>name</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody class="text-white">{this.createTable()}</tbody>
              </Table>
            </Col>
           
              
            <div className="d-flex flex-md-column flex-row">
              {console.log(this.state.status)}
              {this.state.help_status ? (
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
                    class="btn btn-outline-danger"
                    style={bigbutton}
                    onClick={this.changeStatusState}
                  >
                    <h1> Not ready</h1>
                  </button>
                </div>
              )}
              {console.log(this.state.status)}
            </div>
          </Row>
          
        </Container>
      </div>
    );
  }
}

export default withRouter(Lobby);
