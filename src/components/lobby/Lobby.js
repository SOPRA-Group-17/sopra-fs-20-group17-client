import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import Lobby from "../../views/Lobby";
import Game from "../shared/models/Game";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      games: null,
      newGame: null
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
    this.setState({ [key]: value });
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
          <Col xs sm md lg xl="2">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs sm md lg xl={{ span: 1, offset: 9 }}>
            <Row>
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
              >
                Edit Profil
              </Button>
            </Row>
            <Row>
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
              >
                Rules
              </Button>
            </Row>
            <Row>
              <Button
                variant="outline-light"
                className="outlineWhite-Dashboard"
              >
                Logout
              </Button>
            </Row>
          </Col>
        </Row>

        <Row>
          <Form className="DashboardForm">
            <Form.Row>
              <Form.Group as={Col} controlId="Lobbys">
                <Form.Control
                  placeholder="Enter a lobby Name"
                  onChange={e => {
                    this.handleInputChange("newGame", e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Lobbys">
                <Button variant="outline-light" className="outlineWhite-Form">
                  Creat Lobby
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
