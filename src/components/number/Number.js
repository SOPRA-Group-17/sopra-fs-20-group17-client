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
  constructor(props) {
    super(props);
    this.state = {
      ID_game: null,
      chosen_number: null,
    };
  }

  async componentDidMount() {
    try {
      // Nik: always use this.setState don't set the state directly
      //id aus url
      this.setState({
        ID_game: this.props.match.params.gameId,
      });
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Nik:
    // gets called every time the component changes (also state changes)
    // you could also compare the prevState with the current state
    // and then save it if something changed
    console.log("------------------------");
    console.log("[componentDidUpdate]");
    console.log("previous state: ", prevState);
    console.log("updated state: ", this.state);
    console.log("------------------------");
  }

  changeNumberState(number1) {
    this.setState(
      {
        chosen_number: number1,
      },
      this.saveChange //Nik: pass a function as callback (gets executed AFTER state change)
    );
  }

  async saveChange() {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        id: this.state.ID_game,
        status: this.state.chosen_number,
      });

      //TODO: Put request with chosen number
      console.log(requestBody);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  handleNumberClickAlternative(number1) {
    this.setState({
      chosen_number: number1,
    });
    this.saveChangeAlternative(number1); //Nik: call the save function with the received number
  }

  async saveChangeAlternative(number) {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        id: this.state.ID_game,
        status: number,
      });

      //TODO: Put request with chosen number
      console.log(requestBody);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  async handleNumberClick(number) {
    // Nik:
    // number is available here, so use it directly if you want to call the backend
    const requestBody = JSON.stringify({
      id: this.state.ID_game,
      status: number,
    });

    this.setState({ chosen_number: number });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call delay of 1second
      console.log(requestBody);
      console.log(this.state); // state is has changed
    } catch (error) {
      console.log(error);
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
            <p>{JSON.stringify(this.state)}</p>
          </Col>
        </Row>

        <Row>
          <Col xs={{ span: 2 }} md={{ span: 1 }}></Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.handleNumberClick(1);
                //this.props.history.push(`/test`);
              }}
            >
              1
            </p>
          </Col>
          <Col xs="4" md="2">
            <p
              style={bignumbers}
              onClick={() => {
                this.handleNumberClickAlternative(2);

                // this.props.history.push(`/esel2`);
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
                // this.props.history.push(`/esel3`);
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
                // this.props.history.push(`/esel4`);
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
                // this.props.history.push(`/esel5`);
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