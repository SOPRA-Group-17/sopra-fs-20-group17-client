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
/*
[
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
], */

class Validation extends React.Component {
  constructor() {
    super();

    this.state = {
      word: null,
      gameId: null,
      hints: [],
      hintsReport: [],
      nr: 2,
      token: null,
      similar: true,
      invalid: [],
      readyToRender: null,
      successfull: 0,
    };

    this.creatReportHintArray = this.creatReportHintArray.bind(this);
    this.reportSimilar = this.reportSimilar.bind(this);
    this.unReportSimilar = this.unReportSimilar.bind(this);
  }

  async componentDidMount() {
    try {
      this.state.token = localStorage.getItem("token");
      this.state.gameId = this.props.match.params.gameId;
      const response = await api.get(`/games/${this.state.gameId}/terms`);

      // Get the returned terme and update the state.
      this.setState({ word: response.data.content });

      this.getHints();

      this.timer = setInterval(() => this.getHints(), 2000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async getHints() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);

      // check if game ready to give hints
      console.log(response.data.status);
      if (response.data.status === "VALIDATION") {
        const response2 = await api.get(`/games/${this.state.gameId}/hints`);
        console.log(response2.data);
        clearInterval(this.timer);
        this.timer = null;
        this.setState({ hints: response2.data }, () =>
          this.creatReportHintArray()
        );
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the hints: \n${handleError(error)}`
      );
    }
  }

  creatReportHintArray() {
    console.log(this.state.hints);
    this.state.hints.forEach((hint) => {
      let marked = "VALID"
      if(hint.status == "INVALID"){
        marked = "INVALID";
      }
      this.state.hintsReport.push({
        content: hint.content,
        token: hint.token,
        marked: marked,
        similarity: hint.similarity,
        reporters: [],
      });
    });
    console.log(this.state.hintsReport);
    this.setState({ readyToRender: true });
  }

  submitReport() {
    this.state.hintsReport.forEach((hint, index) => {
      const requestBody = JSON.stringify({
        token: hint.token,
        marked: hint.marked,
        similarity: hint.similarity,
        reporters: [this.state.token],
      });
      this.submitReportPut(requestBody, index);
    });
  }

  async submitReportPut(requestBody, index) {
    try {
      //what should i add to reporters?,why error 500?

      const response = await api.put(
        `/games/${this.state.gameId}/hints`,
        requestBody
      );

      console.log(index, this.state.hintsReport.length - 1);
      //does this work
      if (index === this.state.hintsReport.length - 1) {
        this.props.history.push(`/game/${this.state.gameId}/evalution`);
      }
    } catch (error) {
      alert(
        `Something went wrong while rendering the clues \n${handleError(error)}`
      );
    }
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  //nr is the nr of card = array index +1
  //x is the nr of hints
  creatButton(x, nr) {
    let Buttons = [];

    for (let i = 1; i <= x; i++) {
      if (nr != i) {
        Buttons.push(
          <ToggleButton
            variant="outline-light"
            value={i - 1}
            onClick={(e) => {
              if (this.state.hintsReport[nr - 1].similarity.includes(i - 1)) {
                console.log("unreport get called to");
                this.unReportSimilar(nr - 1, i - 1);
                e.preventDefault();
              } else {
                this.reportSimilar(nr - 1, i - 1);
                e.preventDefault();
              }
            }}
          >
            {i}
          </ToggleButton>
        );
      } else {
      }
    }
    return Buttons;
  }

  unReportSimilar(index1, index2) {
    //deleting similarity index1

    let similar1 = this.state.hintsReport[index1].similarity;
    if (similar1.includes(index2)) {
      let newArray1 = this.state.hintsReport;
      for (var i = 0; i < similar1.length; i++) {
        if (similar1[i] === index2) {
          similar1.splice(i, 1);
        }
        newArray1[index1] = { ...newArray1[index1], similarity: similar1 };
        this.setState({ hintsReport: newArray1 });
      }
    }

    //deleting similarity index2

    let similar2 = this.state.hintsReport[index2].similarity;
    if (similar2.includes(index1)) {
      let newArray2 = this.state.hintsReport;
      for (var i = 0; i < similar2.length; i++) {
        if (similar2[i] === index1) {
          similar2.splice(i, 1);
        }
        newArray2[index2] = { ...newArray2[index2], similarity: similar2 };
        this.setState({ hintsReport: newArray2 });
      }
    }

    console.log(this.state.hintsReport);
  }

  reportSimilar(index1, index2) {
    //updating similarity index1

    let similar1 = this.state.hintsReport[index1].similarity;
    if (!similar1.includes(index2)) {
      let newArray1 = this.state.hintsReport;
      similar1.push(index2);

      newArray1[index1] = { ...newArray1[index1], similarity: similar1 };
      this.setState({ hintsReport: newArray1 });
    }
    //updating similarity index2
    let similar2 = this.state.hintsReport[index2].similarity;
    if (!similar2.includes(index1)) {
      let newArray2 = this.state.hintsReport;
      similar2.push(index1);

      newArray2[index2] = { ...newArray2[index2], similarity: similar2 };
      this.setState({ hintsReport: newArray2 });
    }
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
              <p className="nr">{index + 1}</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">{hint.content}</p>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is to similar to:</p>
            </div>
            <div class="row justify-content-center">
              <ToggleButtonGroup
                key={index - 1}
                type="checkbox"
                value={this.state.hintsReport[index].similarity}
                className="mb-2"
                variant="outline-danger"
              >
                {this.creatButton(totalNr, index + 1)}
              </ToggleButtonGroup>
            </div>
            <div class="row justify-content-center">
              <p className="card-text">Clue is invalid?</p>
            </div>
            <div class="row justify-content-center">
              {hint.marked === "VALID" ? (
                <Button
                  size="md"
                  variant="outline-danger"
                  className="button-card"
                  style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
                  onClick={() => {
                    let newArray = this.state.hintsReport;
                    newArray[index] = { ...newArray[index], marked: "INVALID" };
                    console.log(newArray);
                    this.setState({ hintsReport: newArray });
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
                    newArray[index] = { ...newArray[index], marked: "VALID" };
                    console.log(newArray);
                    this.setState({ hintsReport: newArray });
                    console.log(this.state.hintsReport);
                  }}
                >
                  NO
                </Button>
              )}
            </div>
          </div>
        </Col>
      );
    });

    return cards;
  };

  render() {
    return (
      <Container fluid>
        {!this.state.readyToRender ? (
          <div>
            <Row>
              <Col xs="5" md="3">
                <img
                  className="logoImgSmall"
                  src={logo}
                  alt="Just One Logo"
                ></img>
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
              style={{ marginTop: "5vw" }}
            >
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for clues to validate</p>
            </div>
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
                  <p className="large-Font">{this.state.word}</p>
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
                disabled={!this.state.readyToRender}
                variant="outline-danger"
                size="lg"
                className="outlineWhite-Dashboard"
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  this.submitReport();
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
