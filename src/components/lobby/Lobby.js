import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import aLobby from "../../views/aLobby";
import Game from "../shared/models/Game";

const lobbyname = {
  fontSize: "4vw",
  textAlign: "center",
  marginTop: "2vw"
};




const bigbutton = {
  width: "22vw",
  height: "8vw"
};

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      games: null,
      newGame: null,
      ready: false
    };
    this.changeReadyState = this.changeReadyState.bind(this);
  }

  async componentDidMount() {
    try {
    } catch (error) {}
  }
  changeReadyState() {
    this.setState(state => ({
      ready: !this.state.ready
    }));
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
                    <td class="text-danger">not ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>2</td>
                    <td>maria</td>
                    <td class="text-success">ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>3</td>
                    <td>pflanze3</td>
                    <td class="text-danger">not ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>4</td>
                    <td>kugelschreiber</td>
                    <td class="text-danger">not ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>5</td>
                    <td>helmut</td>
                    <td class="text-success">ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>6</td>
                    <td>boxinator</td>
                    <td class="text-danger">not ready</td>
                  </tr>
                  <tr class="text-white">
                    <td>7</td>
                    <td>eiermensch</td>
                    <td class="text-success">not ready</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={{ span: 2, offset: 3 }} md={{ span: 2, offset: 2 }}>
              {console.log(this.state.ready)}
              {this.state.ready ? (
                <div>
                  <button
                    class="btn btn-outline-success"
                    style={bigbutton}
                    onClick={this.changeReadyState}
                    
                  >
                    <h1>ready</h1>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={this.changeReadyState}
                    class="btn btn-outline-danger"
                    style={bigbutton}
                  >
                   <h1> Not Ready</h1>
                  </button>
                </div>
              )}
              {console.log(this.state.ready)}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Lobby);
