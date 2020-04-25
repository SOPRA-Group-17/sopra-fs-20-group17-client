import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";
import { Spinner } from "../../views/design/Spinner";

const bigbutton = {
  padding: "0.5vw 1.5vw 0.5vw 1.5vw",
  fontSize: "calc(0.5em, 0.5vw)",
  //top right bottom left
};

class EnterGuess extends React.Component {
  constructor() {
    super();

    this.state = {
      playerToken: null,
      playerId: null,
      gameId: null,
      roundId: null,
      hints: null,
      //hints: [],
      guess: null,
      timer: null,
      readyToRender: null,
    };
    this.getHints = this.getHints.bind(this);
  }

  async componentDidMount() {
    try {
      // set the states
      this.state.playerToken = localStorage.getItem("token");
      this.state.playerId = localStorage.getItem("Id");
      this.state.gameId = this.props.match.params.gameId;

      // get all the given hints
      this.getHints();
      this.timer = setInterval(() => this.getHints(), 2000);
    } catch (error) {
      alert(
        `Something went wrong while setting up the page: \n${handleError(
          error
        )}`
      );
    }
  }

  async getHints() {
    try {
      const response = await api.get(`/games/${this.state.gameId}`);

      // check if game ready to give hints
      console.log(response.data.status);
      if (response.data.status === "RECEIVING_GUESS") {
        const response = await api.get(`/games/${this.state.gameId}/hints`);
        console.log(response.data);
        this.setState({ hints: response.data });
        clearInterval(this.timer);
        this.timer = null;
        this.setState({ readyToRender: true });
      }
    } catch (error) {
      alert(
        `Something went wrong while getting the hints: \n${handleError(error)}`
      );
    }
  }

  async submit() {
    try {
      const requestBody = JSON.stringify({
        content: this.state.guess,
        token: this.state.playerToken,
      });

      console.log(requestBody);
      // TODO: adapt url and request parameters
      const response = await api.post(
        `/games/${this.state.gameId}/guesses`,
        requestBody
      );

      console.log(response);
      // TODO: what is the url of the page you are directed to?
      this.props.history.push(`/game/${this.state.gameId}/evalution`);
    } catch (error) {
      alert(
        `Something went wrong while submitting the guess: \n${handleError(
          error
        )}`
      );
    }
  }

  async skip() {
    try {
      console.log(this.state.playerToken);
      const requestBody = JSON.stringify({
        token: this.state.playerToken,
      });
      
      // doesnt work but why, because request body not supported
      
       const response = await api.delete(
        `/games/${this.state.gameId}/guesses`,
        {data: requestBody}
      );

      console.log(response);
        /*
      const request =  new HttpRequestMessage{
        Method = HttpMethod.Delete,
        RequestUri = `/games/${this.state.gameId}/guesses`,
        Content = requestBody,
    };

    var response = await client.SendAsync(request);
*/

      /*
        var request = new HttpRequestMessage {
              Method = HttpMethod.Delete,
              RequestUri = new Uri("http://mydomain/api/something"),
              Content = new StringContent(JsonConvert.SerializeObject(myObj), Encoding.UTF8, "application/json")
          };
          var response = await client.SendAsync(request);

      */

      
      // TODO: what is the url of the page you are directed to?
      this.props.history.push(`/game/${this.state.gameId}/evalution`);
    } catch (error) {
      alert(`Something went wrong while skipping: \n${handleError(error)}`);
    }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  createTable = () => {
    let table = [];

    //do we have to look at status?
    //TODO 
    this.state.hints.forEach((hint) => {
      if (hint.status == "VALID") {
        table.push(
          <tr class="text-white" class="text-center">
            {hint.content}
          </tr>
        );
    }
  });

    return table;
  };

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
              >
                Rules
              </Button>
            </Row>
          </Col>
        </Row>
        {!this.state.readyToRender ? (
          <div>
            <div
              class="row justify-content-center"
              style={{ marginTop: "5vw" }}
            >
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">Waiting for the hints</p>
            </div>
          </div>
        ) : (
          <div>
            <Row className="hints-table">
              <Col
                xs={{ span: 10, offset: 1 }}
                md={{ span: 6, offset: 3 }}
                lg={{ span: 4, offset: 4 }}
              >
                <Table bordered size="sm" className="font-medium">
                  <thead class="text-white">
                    <tr>
                      <th
                        class="text-center"
                        style={{
                          fontSize: "calc(1em + 0.8vw)",
                          color: "white",
                        }}
                      >
                        hints
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-white" className="font-medium">
                    {this.createTable()}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <div class="row justify-content-center">
              <input
                style={{
                  backgroundColor: "#291f33",
                  border: "0.05vw solid white",
                  padding: "0.5vw 0.5vw 0.5vw  1vw ",
                  color: "white",
                  width: "calc(8em + 23vw)",
                  fontSize: "calc(1em + 1vw)",
                }}
                placeholder="Enter your guess here... "
                onChange={(e) => {
                  this.handleInputChange("guess", e.target.value);
                }}
              />
            </div>

            <div class="row justify-content-center">
              <Button
                variant="outline-light"
                className="outlineWhite-Guess"
                size="lg"
                disabled={!this.state.guess}
                onClick={() => {
                  this.submit();
                }}
              >
                Submit
              </Button>
            </div>

            <div class="row justify-content-center">
              <Button
                variant="outline-light"
                className="outlineWhite-Guess"
                size="lg"
                onClick={() => {
                  this.skip();
                }}
              >
                Skip
              </Button>
            </div>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(EnterGuess);
