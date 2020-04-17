import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter, useParams } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Button,
  ToggleButton,
  ToggleButtonGroup,
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
        {
          roundId: 1,
          content: "someHint3",
          token: "abcdef-3",
          status: "UNKNOWN",
          marked: "UNKNOWN",
          similarity: [],
          reporters: [],
        },
      ],
      hintsReport: [],
      nr: 2,
      similar: true,
      invalid: [],
      readyToRender: null
    };
    this.setSimilar = this.setSimilar.bind(this);
    this.setInvalid = this.setInvalid.bind(this);
    this.creatReportHintArray = this.creatReportHintArray.bind(this);
    this.reportSimilar = this.reportSimilar.bind(this);
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

  creatReportHintArray() {
    
    this.state.hints.forEach((hint) => {
      this.state.hintsReport.push({
        content: hint.content,
        token: hint.token,
        marked: "VALID",
        similarity: [],
        reporters: [],
      });
    });
    console.log(this.state.hintsReport);
    this.setState({readyToRender: true});
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

  setInvalid(token, invalid) {
    if (invalid === true) {
      this.state.invalid.push(token);
      console.log("setting invalid");
    } else {
      for (var i = 0; i < this.state.invalid.length; i++) {
        if (this.state.invalid[i] === token) {
          this.state.invalid.splice(i, 1);
        }
      }
      console.log("setting back to valid");
    }

    console.log(this.state.invalid);
  }

  //nr is the nr of card = array index +1
  creatButton(x, nr) {
    let Buttons = [];
  
    for (let i = 1; i <= x; i++) {
      if(nr != i){
        Buttons.push(
          <ToggleButton variant="outline-light" value={i-1} 
          onClick ={() => {
              this.reportSimilar(i-1, nr-1);
          }}
          >{i}</ToggleButton>
        );
        }
      else{

      }
      
    }
    return Buttons;
  }
  
  
  reportSimilar(index1, index2){
    console.log(index1,index2);
    let newArray = this.state.hintsReport;
    //newArray[index1].similarity.push(index2)
    
    let similar1 = this.state.hintsReport[index1].similarity;
    
    
    newArray[index1] = {...newArray[index1], similarity : [3]}
    newArray[index2] = {...newArray[index2], similarity : [3]}
    
    this.setState({hintsReport : newArray});
    console.log(this.state.hintsReport);

  }

  createCards = () => {
    let cards = [];
    let totalNr = this.state.hintsReport.length;


    this.state.hintsReport.forEach((hint, index) => {
      
      cards.push(
      <Col
        style={{ border: "calc(0.025em + 0.025vw) solid white" }}
        key={hint.token}
      >
        <div>
          <div class="row justify-content-center">
            <p className="nr">{index+1}</p>
          </div>
          <div class="row justify-content-center">
            <p className="card-text">{hint.content}</p>
          </div>
          <div class="row justify-content-center">
            <p className="card-text">Clue is to similar to:</p>
          </div>
          <div class="row justify-content-center">
          <ToggleButtonGroup type="checkbox" defaultValue={this.state.hintsReport[index].similarity} className="mb-2" variant="outline-danger">
              {this.creatButton(totalNr, index+1)}
          </ToggleButtonGroup>
          </div>
          <div class="row justify-content-center">
            <p className="card-text">Clue is invalid?</p>
          </div>
          <div class="row justify-content-center">
            { hint.marked === "VALID" ? (
              <Button
                size="md"
                variant="outline-danger"
                className="button-card"
                style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
                onClick={() => {
                  let newArray = this.state.hintsReport;
                  newArray[index] = {...newArray[index], marked : "INVALID" }
                  console.log(newArray);
                  this.setState({hintsReport : newArray});
                  console.log(this.state.hintsReport);
                }}
              >
                YES
              </Button>
            ) : (
              <Button
                size="md"
                variant="outline-success"
                className="button-card"
                style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
                onClick={() => {
                  let newArray = this.state.hintsReport;
                  newArray[index] = {...newArray[index], marked : "VALID" }
                  console.log(newArray);
                  this.setState({hintsReport : newArray});
                  console.log(this.state.hintsReport);
                }}
              >
                NO
              </Button>
            )}
          </div>
        </div>
      </Col>)
    });
    

    return cards;
  };

  render() {
    return (
      <Container fluid>
        {!this.state.readyToRender ? (
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
              {this.createCards()}
               
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
