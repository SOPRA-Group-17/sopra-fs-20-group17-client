import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

class Evalution extends React.Component {
  constructor() {
    super();

    this.state = {
      gameId: null,
      word: null,
      guess: "Guesser didn´t give his guess yet",
      timer:null,
      gameStatus:null,
    };
  }

  async componentDidMount() {
    try {
      
      console.log("comp");
      this.state.gameId = this.props.match.params.gameId;
      this.state.id = localStorage.getItem("Id");
      this.state.token = localStorage.getItem("token");
      

      const response = await api.get(`/games/${this.state.gameId}/terms`);

      this.setState({ word: response.data });

      this.getGuess();

      this.timer = setInterval(() => this.getGuess(), 2000);

    } catch (error) {
      alert(
        `Something went wrong while getting the term: \n${handleError(error)}`
      );
    }
  }
  async getGuess(){
    try{
      const response = await api.get(`/games/${this.state.gameId}`);
      this.setState({gameStatus: response.data.status})
      // check if game ready to give hints
      console.log(response.data.status);
      if (response.data.status === "FINISHED" ||response.data.status === "RECEIVINGTERM"  ) {
        const response2 = await api.get(`/games/${this.state.gameId}/guesses`);
        //const response2 = await api.get(`/games/${this.state.gameId}/rounds`);
        //console.log(response2.data[end-1]);
        this.setState({ guess: response2.data });
        clearInterval(this.timer);
        this.timer =null;
        this.timer = setInterval(() => this.startNewRound(), 10000);
      }
      
    }
    catch (error) {
      alert(
        `Something went wrong while getting the guess: \n${handleError(error)}`
      );
    }
   

  }

  startNewRound(){
    console.log("starting new round");
    clearInterval(this.timer);
    this.timer =null;
  }

 

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
                size="lg"
              >
                Rules
              </Button>
            </Row>
          </Col>
        </Row>
        <div
          class="row justify-content-center"
          style={{ marginTop: "calc(1.2em + 2vw)" }}
        >
          <p className="large-Font">Given word: {this.state.word}</p>
        </div>
        <div
          class="row justify-content-center"
          style={{ marginTop: "calc(0.5em + 1.5vw)" }}
        >
          <p className="large-Font">Guess: {this.state.guess}</p>
        </div>
      </Container>
    );
  }
}

export default withRouter(Evalution);
