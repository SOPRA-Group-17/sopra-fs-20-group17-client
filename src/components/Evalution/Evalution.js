import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import aLobby from "../../views/aLobby";
import Game from "../shared/models/Game";
import { Spinner } from "../../views/design/Spinner";

class Evalution extends React.Component {
  constructor() {
    super();

    this.state = {
      word: "Example",
      clue: null,
      gameId:null,
      word: "example",
      guess:"example",
      
    };
  }

  async componentDidMount() {
    try {
      this.state.gameId = this.props.match.params.gameId;
      
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
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
        <div  class="row justify-content-center" style={{marginTop:"calc(1.2em + 2vw)"}}  >
                <p className="large-Font">
                    Given word: {this.state.word}
                </p>

        </div>
        <div  class="row justify-content-center"  style={{marginTop:"calc(0.5em + 1.5vw)"}}>
                <p className="large-Font">
                    Guess: {this.state.guess}
                </p>

        </div>
    
        
      </Container>
    );
  }
}

export default withRouter(Evalution);
