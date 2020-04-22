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
  //top right bottom left
  padding: "2vw 3vw 2vw 3vw",
  marginTop: 0,
  marginLeft: "10vw",
};

const tablebutton = {
  //top right bottom left
  margin: "0.33vw 0.2vw 0.33vw 0.33vw",
};

class LobbyHost extends React.Component {
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
      help_status: null,
      exit: false,
      kick: false,
    };

    this.changeStatusState = this.changeStatusState.bind(this);
  }

  async componentDidMount() {
    try {
      //id aus url
      this.state.ID_game = this.props.match.params.gameId;

      //player id aus local storage, set in dahboard
      this.state.ID_player = localStorage.getItem("Id");

      //set player and playerstatus
      const response = await api.get(`/games/players/${this.state.ID_player}`);

      /*
      initial set state of:
      - player
      - and its status
      */
      this.setState({
        player: response.data,
        status: this.state.player.status,
      });

      //helper state for the if else clause in the render function (needs true false value)
      if (this.state.player.status === "READY") {
        this.setState({ help_status: true });
        console.log(this.state.help_status);
      } else {
        this.setState({ help_status: false });
      }

      //poll every 1 seconds all players, search game
      this.timer = setInterval(() => this.getStatus(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async getStatus() {
    console.log(this.state.players)
    console.log(this.state.kick)

    try {
      //variable abhängig exit lobby
      if (!this.state.exit && !this.state.kick) {
        console.log(localStorage);
        //get current player
        const current_player = await api.get(
          `/games/players/${this.state.ID_player}`
        );

        //get all players
        const all_players = await api.get(
          `/games/${this.state.ID_game}/players`
        );

        //get the game and its status
        const get_game = await api.get(`/games/${this.state.ID_game}`);

        /*
      set and update state of:
      - current player
      - all players
      - game
      - game status

      then check if the game is ready to start
      */

        this.setState(
          {
            player: current_player.data,
            status: current_player.data.status,
            players: all_players.data,
            game: get_game.data,
            game_status: get_game.data.status,
          },

          this.startGame
        );
        //set local storage item "status"
        localStorage.setItem("status", this.state.player.status);
      }
      else if (this.state.kick === true){
        this.setState({
          kick: false
        });
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }
  changeStatusState() {
    if (this.state.help_status === true) {
      this.setState(
        {
          status: "NOT_READY",
          help_status: false,
        },
        this.saveChangePlayerStatus
      );
    } else {
      this.setState(
        {
          status: "READY",
          help_status: true,
        },
        this.saveChangePlayerStatus
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
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
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

  createTable() {
    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < this.state.players.length; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 0; j < 4; j++) {
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
        if (j === 3) {
          if (this.state.players[i].role === "GUEST") {
            //you cannot kick yourself
            children.push(
              <td>
                <Button
                  variant="outline-light"
                  style={tablebutton}
                  onClick={() => {
                    this.kickPlayer(this.state.players[i].id);
                  }}
                >
                  Kick
                </Button>
              </td>
            );
          } else {
            children.push(<p></p>);
          }
        }
      }
      table.push(<tr class="text-white">{children}</tr>);
    }
    //Create the parent and add the children
    return table;
  }
  async kickPlayer(id) {
    /*
    if a user exits the lobby then:
    - change status to not ready
    - delete player from player list in game
    - redirect to dashboard
  
    */

    //change status to not ready
    for (let i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].id === id) {
        this.setState(
          {
            status: "NOT_READY",
            help_status: false,
            kick: true
          },
          this.saveChangePlayerStatus
        );
        //need time to change player status
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          let requestBody;

          //delete player from player list in game
          requestBody = JSON.stringify({
            player: this.state.players[i].id,
          });
          // send request body to the backend
          console.log("this is the players id to delete:")
          console.log(requestBody);
          // was muss genau in request body / Jetzt: der rausgeschmissen wird. soll? der der rausschmeisst?
          await api.delete(
            `/games/${this.state.ID_game}/players/${this.state.players[i].id}`,
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
    }
  }

  startGame() {
    //as soon as game ready, start the game
    console.log(this.state.game.status);
    console.log(this.state.player.role);
    if (this.state.game_status === "RECEIVINGTERM") {
      if (this.state.player.status === "GUESSER") {
        clearInterval(this.timer);
            this.timer = null;
        this.props.history.push(`/game/${this.state.ID_game}/number`);
      } else if (this.state.player.status === "CLUE_GIVER") {
        clearInterval(this.timer);
            this.timer = null;
        this.props.history.push(`/game/${this.state.ID_game}/reportword`);
      }
    }
  }

  async exitLobby() {
    /*
    if a user exits the lobby then:
    - change status to not ready
    - delete player from player list in game
    - redirect to dashboard
  
    */

    //TODO: nächster Spieler neuer Host,
    //TODO: wenn er alleine war dann delete Lobby

    //change status to not ready
    this.setState(
      {
        status: "NOT_READY",
        help_status: false,
        exit: true,
      },
      this.saveChangePlayerStatus
    );
    //need time to change player status
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let requestBody;

      //delete player from player list in game
      requestBody = JSON.stringify({
        player: this.state.player,
      });
      // send request body to the backend
      console.log(requestBody);
      await api.delete(
        `/games/${this.state.ID_game}/players/${this.state.ID_player}`,
        requestBody
      );
      //change local storage
      localStorage.removeItem("status");
      localStorage.removeItem("gameId");
      localStorage.removeItem("role");
      localStorage.removeItem("Id");
      clearInterval(this.timer);
      this.timer = null;
      this.props.history.push("/dashboard");
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
            <Col xs={{ span: 3, offset: 0 }} md={{ span: 2, offset: 2 }}>
              <Row>
                <p style={lobbyname}>{this.state.game.name}</p>
              </Row>
            </Col>
            <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 3 }}>
              <Row className="d-flex justify-content-end">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => this.exitLobby()}
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
            <Col xs="7" md="4">
              <Table striped bordered hover size="sm">
                <thead class="text-white">
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>status</th>
                    <th>kick player</th>
                  </tr>
                </thead>
                <tbody>{this.createTable()}</tbody>
              </Table>
            </Col>

            <div className="d-flex flex-md-column flex-row">
              {console.log(this.state.help_status)}
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

export default withRouter(LobbyHost);
