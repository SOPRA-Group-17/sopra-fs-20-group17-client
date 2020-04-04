import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import Lobby from "../../views/aLobby";
import Game from "../shared/models/Game";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      games: null,
      newGame: null,
      toLong: null,
    };
  }
  /*
({data:{id: 2, name: "Jonas", usernames: null, status: "not ready"}}),
this.setState({ games: {data:{id: 2, name: "Jonas", usernames: null, status: "not ready"}}.data });
*/
  async componentDidMount() {
    try {
    } catch (error) {}
  }
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    if (value.length > 15) {
      this.setState({ ["toLong"]: "YES" });
      this.setState({ [key]: null });
    } else {
      this.setState({ ["toLong"]: null });
      this.setState({ [key]: value });
    }

    console.log(this.state.newGame);
  }

  async creatLobby() {
    try {
      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
        Game: this.state.newGame,
      });
      const response = await api.post("/games");

      const game = new Game(response.Data);

      //TODO: get this to work
      this.props.history.push(`/lobby/host/${game.id}`);
    } catch (error) {
      alert(`Couldnt creat the lobby: \n${handleError(error)}`);
    }
  }

  async logout() {
    try {
      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
      });
      // Get the returned user and update a new object.

      const response = await api.put("/logout", requestBody);

      //gets igonred
      const user = new User(response.data);

      localStorage.removeItem("token");

      this.props.history.push("/login");
    } catch (error) {
      alert(`Something went wrong during logout \n${handleError(error)}`);

      //maybe take this out
      this.props.history.push("/login");
    }
  }

  /*{this.state.games.map(game => {
                    return (
                        
                        <Lobby game = {game}/>
                       
                    );
                    })} */

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
                Edit Profil
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
            <Row className="d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
                onClick={() => {
                  this.logout();
                }}
              >
                Logout
              </Button>
            </Row>
          </Col>
        </Row>
        <Row></Row>

        <Row>
          <Form className="DashboardForm">
            <Form.Row>
              <p style={{ color: "red" }} hidden={!this.state.toLong}>
                Lobbyname is to long
              </p>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="Lobbys">
                <Form.Control
                  placeholder="Enter a Lobbyname"
                  onChange={(e) => {
                    this.handleInputChange("newGame", e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Lobbys">
                <Button
                  variant="outline-light"
                  className="outlineWhite-Form"
                  disabled={!this.state.newGame}
                  onClick={() => {
                    this.creatLobby();
                  }}
                >
                  Create Lobby
                </Button>
              </Form.Group>
            </Form.Row>

            <Form.Row class="row align-items-end">
              <Form.Group as={Col} controlId="Lobbys">
                <Form.Label>Select a Lobby</Form.Label>
                <Form.Control as="select">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="Lobbys">
                <Button variant="outline-light" className="outlineWhite-Form">
                  Join Lobby
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Dashboard);
