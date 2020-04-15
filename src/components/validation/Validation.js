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
import Card from '../../views/Card';

class Validation extends React.Component {
  constructor() {
    super();

    this.state = {
      word: "Example",
      clue: null,
      gameId: null,
      hints: ["jonas", "janosch"],
      nr: 2,
      totalNr: 3,
      similar:null,

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

  setState(){
    this.setState({similar:true})
    console.log(this.state.similar)
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

  render() {
    return (
      <Container fluid>
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
                  <Col style={{ border: "calc(0.025em + 0.025vw) solid white" }} key={index}>
                      <Card hint={hint} nr={index} totalNr={this.state.hints.length}/>
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
      </Container>
    );
  }
}

export default withRouter(Validation);
