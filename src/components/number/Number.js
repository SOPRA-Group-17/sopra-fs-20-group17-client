import React from "react";
import logo from "../styling/JustOne_logo_white.svg";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { api, handleError } from "../../helpers/api";

const bignumbers = {
  fontSize: "18vw",
  textAlign: "center",
  opacity: 0.2,
  cursor: "pointer",
};
const sentence = {
  fontSize: "5vw",
  textAlign: "center",
  opacity: 0.2,
};

class Number extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.state = {
      ID_game: null,
      chosen_number: null
    }
  }

  async componentDidMount() {
    try {
      //id aus url
      this.state.ID_game = this.props.match.params.gameId;
 
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  changeNumberState(number1) {
    this.setState((state) => ({
      chosen_number: number1
    }));
    this.saveChange();
  }

  async saveChange() {
    try {
     
      let requestBody;

      requestBody = JSON.stringify({
        id: this.state.ID_game,
        status: this.state.chosen_number,
      });

      console.log(requestBody);
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
      <Container fluid>
        <Row>
          {" "}
          <Col xs="5" md="2">
            <img className="logoImgSmall" src={logo} alt="Just One Logo"></img>
          </Col>
          <Col xs={{ span: 3, offset: 4 }} md={{ span: 2, offset: 8 }}>
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
        <Row>
          <Col>
            <p style={sentence}>Pick a number</p>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 2 }} md={{ span: 1 }}></Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.changeNumberState(1);
                this.props.history.push(`/esel1`);                
              }}
            >
              1
            </p>
          </Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.changeNumberState(2);
                this.props.history.push(`/esel2`);
              }}
            >
              2
            </p>
          </Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.changeNumberState(3);
                this.props.history.push(`/esel3`);
              }}
            >
              3
            </p>
          </Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.changeNumberState(4);
                this.props.history.push(`/esel4`);
              }}
            >
              4
            </p> 
          </Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.changeNumberState(5);
                this.props.history.push(`/esel5`);
              }}
            >
              5
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Number);
