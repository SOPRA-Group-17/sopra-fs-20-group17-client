import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter, useParams } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";
import Card from "../../views/Card";

class Validation extends React.Component {
  constructor() {
    super();

    this.state = {
      word: "Example",
      clue: null,
      gameId: null,
      hints: [
        {
          roundId: 1,
          content: "someHint",
          token: "abcdef-1",
          status: "UNKNOWN",
          marked: "UNKNOWN",
          similarity: [],
          reporters: [],
        },
        {
          roundId: 1,
          content: "someHint2",
          token: "abcdef-2",
          status: "UNKNOWN",
          marked: "UNKNOWN",
          similarity: [],
          reporters: [],
        },
      ],
      hintsReport:[],
      nr: 2,
      similar: true,
      invalid: [],
    };
    this.setSimilar = this.setSimilar.bind(this);
    this.setInvalid = this.setInvalid.bind(this);
    this.creatReportHintArray = this.creatReportHintArray.bind(this);
  }

  async componentDidMount() {
    try {
      this.state.gameId = this.props.match.params.gameId;
      console.log(this.state.hints.length);

      this.creatReportHintArray();
      
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  creatReportHintArray(){
    this.state.hints.forEach(hint => {
      
      this.state.hintsReport.push({token: hint.token, marked: "VALID", similarity: [], reporters: []} );
    });
    console.log(this.state.hintsReport);

  }

  async submitClue() {
    try {
    } catch (error) {
      alert(
        `Something went wrong while submiting the clue \n${handleError(error)}`
      );
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }
  setSimilar(nr) {
    console.log(this.state.similar);
    this.setState({ similar: !this.state.similar });
    console.log(this.state.similar);
  }

  setInvalid(token, invalid){
    if(invalid === true){
      this.state.invalid.push(token);
      console.log("setting invalid");
    }
    else{
      for( var i = 0; i < this.state.invalid.length; i++){
         if ( this.state.invalid[i] === token) {
          this.state.invalid.splice(i, 1); }}
      console.log("setting back to valid");
    }

    
      console.log(this.state.invalid);
  }

  

  render() {
    return (
      <Container fluid>
        {!this.state.hints ? (
          <div>
            <Spinner />
            <p>Waiting for the word to guess</p>
          </div>
        ) : (
          <div>
            <Row>
              <Col xs="4" md="2">
                <img className="logoImgXS" src={logo} alt="Just One Logo"></img>
              </Col>
              <Col xs={{ span: 4, offset: 0 }} md={{ span: 4, offset: 2 }}>
                <div
                  class="row justify-content-center"
                  style={{ marginTop: "1vw" }}
                >
                  <p className="large-Font">Testname</p>
                </div>
              </Col>
              <Col xs={{ span: 3, offset: 1 }} md={{ span: 2, offset: 2 }}>
                <Row className="d-flex justify-content-end">
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    size="md"
                  >
                    Rules
                  </Button>
                </Row>
              </Col>
            </Row>

            <div
              class="row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center "
              style={{
                marginLeft: "calc(3em + 1vw)",
                marginRight: "calc(3em + 1vw)",
              }}
            >
              {this.state.hints.map((hint, index) => {
                return (
                  <Col
                    style={{ border: "calc(0.025em + 0.025vw) solid white" }}
                    key={hint.token}
                  >
                    <Card
                      hint={hint}
                      nr={index}
                      totalNr={this.state.hints.length}
                      setSimilar={this.setSimilar}
                      setInvalid={this.setInvalid}
                    />
                  </Col>
                );
              })}
            </div>

            <div class="row justify-content-center">
              <Button
                disabled={!this.state.clue}
                variant="outline-danger"
                size="lg"
                className="outlineWhite-Dashboard"
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  this.submitClue();
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Container>
    );
  }
}

//d-flex  flex-md-row  flex-column"

  /*
   <Col style={{ border: "calc(0.025em + 0.025vw) solid white" }}>
            <div class="row justify-content-center">
              <p className="nr">1</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Example</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is to similar to:</p>
            </div>
            <div class="row justify-content-center">
              <ButtonGroup size="md">
                <Button variant="outline-light">1</Button>
                <Button variant="outline-light">2</Button>
                <Button variant="outline-light">3</Button>
                <Button variant="outline-light">4</Button>
                <Button variant="outline-light">5</Button>
                <Button variant="outline-light">6</Button>
              </ButtonGroup>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is invalid?</p>
            </div>
            <div class="row justify-content-center">
              <Button
                size="sm"
                variant="outline-light"
                className="button-card"
                style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
              >
                Yes
              </Button>
            </div>
          </Col>
          <Col style={{ border: "calc(0.025em + 0.025vw) solid white" }}>
            <div class="row justify-content-center">
              <p className="nr">1</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Example</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is to similar to:</p>
            </div>
            <div class="row justify-content-center">
              <ButtonGroup size="md">
                <Button variant="outline-light">1</Button>
                <Button variant="outline-light">2</Button>
                <Button variant="outline-light">3</Button>
                <Button variant="outline-light">4</Button>
                <Button variant="outline-light">5</Button>
                <Button variant="outline-light">6</Button>
              </ButtonGroup>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is invalid?</p>
            </div>
            <div class="row justify-content-center">
              <Button
                size="sm"
                variant="outline-light"
                className="button-card"
                style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
              >
                Yes
              </Button>
            </div>
          </Col>
          */

export default withRouter(Validation);
