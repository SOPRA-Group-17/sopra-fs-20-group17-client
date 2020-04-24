import React from "react";
import logo from "../styling/JustOne_logo_white.svg";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../../views/design/Spinner";

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
      game: null,
      game_status: null,
      chosen_number: [],
      readyToRender: true,
      readyForNext: false,
      hide1: false,
      hide2: false,
      hide3: false,
      hide4: false,
      hide5: false,
    };
  }

  async componentDidMount() {
    try {
      //console.log(localStorage);
      // Nik: always use this.setState don't set the state directly
      //id aus url
      this.setState({
        ID_game: this.props.match.params.gameId,
      });

      this.setNumberState();

      //poll every 1 seconds all players, search game
      this.timer = setInterval(() => this.getGameStatus(), 1000);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }
  async getGameStatus() {
    try {
      if (!this.state.readyForNext) {
        this.setNumberState();
        //get the game and its status
        const get_game = await api.get(`/games/${this.state.ID_game}`);
        this.setState({
          game: get_game.data,
          game_status: get_game.data.status,
        });
        if (get_game.data.status === "RECEIVING_GUESS") {
          this.setState({
            readyForNext: true,
            readyToRender: false,
          });
        }
        if (get_game.data.status === "RECEIVING_TERM") {
          this.setState({
            readyForNext: false,
            readyToRender: true,
          });
        }
      } else {
        //clear timer and push to enter guess
        clearInterval(this.timer);
        this.timer = null;
        this.props.history.push(`/game/${this.state.ID_game}/enterguess`);
      }
    } catch (error) {
      alert(
        `Something went wrong while fetching the data: \n${handleError(error)}`
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Nik:
    // gets called every time the component changes (also state changes)
    // you could also compare the prevState with the current state
    // and then save it if something changed
    /*
    console.log("------------------------");
    console.log("[componentDidUpdate]");
    console.log("previous state: ", prevState);
    console.log("updated state: ", this.state);
    console.log("------------------------");
    */
  }

  changeNumberState(number1) {
    this.setState(
      {
        chosen_number: number1,
        readyToRender: false,
      },
      this.saveChange //Nik: pass a function as callback (gets executed AFTER state change)
    );
    this.saveChangeAlternative(number1);
  }

  handleNumberClickAlternative(number1) {
    this.setState({
      chosen_number: number1,
      readyToRender: false,
    });
    this.saveChangeAlternative(number1); //Nik: call the save function with the received number
  }

  async saveChangeAlternative(number) {
    try {
      let requestBody;

      requestBody = JSON.stringify({
        wordId: number - 1,
        token: localStorage.getItem("token"),
      });
      /*
      console.log(number - 1);
      console.log(requestBody);
      console.log(localStorage.getItem("status"));
      */

      const response = await api.post(
        `/games/${this.state.ID_game}/terms`,
        requestBody
      );
      /*
      console.log(requestBody);
      console.log(localStorage.getItem("status"));
      */

      // Get the existing data
      var existing = localStorage.getItem("chosen_nr");

      // If no existing data, create an array
      // Otherwise, convert the localStorage string to an array
      existing = existing ? existing.split(",") : [];

      // Add new data to localStorage Array
      existing.push(number);

      // Save back to localStorage
      localStorage.setItem("chosen_nr", existing.toString());

      //true or false if number was used before from this player
      //TODO delete it from the local storage at end of round
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
      readyToRender: false,
    });

    this.setState({ chosen_number: number });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate backend call delay of 1second
      /*
      console.log(requestBody);
      console.log(this.state); // state is has changed
      */
      this.saveChangeAlternative(number);
    } catch (error) {
      console.log(error);
    }
  }

  setNumberState() {
    if (localStorage.getItem("chosen_nr")) {
      console.log("am i getting here");
      if (this.checkIfNumberAlreadyUsed(1)) {
        this.setState({
          hide1: true,
        });
      } else {
        this.setState({
          hide1: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(2)) {
        this.setState({
          hide2: true,
        });
      } else {
        this.setState({
          hide2: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(3)) {
        this.setState({
          hide3: true,
        });
      } else {
        this.setState({
          hide3: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(4)) {
        this.setState({
          hide4: true,
        });
      } else {
        this.setState({
          hide4: false,
        });
      }
      if (this.checkIfNumberAlreadyUsed(5)) {
        this.setState({
          hide5: true,
        });
      } else {
        this.setState({
          hide5: false,
        });
      }
    }
  }

  checkIfNumberAlreadyUsed(number) {
    console.log("-------------------------");
    console.log(number.toString());
    console.log(localStorage.getItem("chosen_nr"));
    console.log(localStorage.getItem("chosen_nr").includes(number.toString()));
    console.log("-------------------------");
    return localStorage.getItem("chosen_nr").includes(number.toString());
  }

  render() {
    return (
      <Container fluid>
        {console.log(this.state.readyToRender)}
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
        {!this.state.readyToRender ? (
          <div style={{ marginTop: "8vw" }}>
            <div class="row justify-content-center">
              <Spinner />
            </div>
            <div class="row justify-content-center">
              <p className="large-Font">
                Waiting for the hint makers to give their hints
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Row>
              <Col>
                <p style={sentence}>Pick a number</p>
                <p>
                  {
                    //JSON.stringify(this.state)}
                  }
                </p>
              </Col>
            </Row>

            <Row>
              <Col xs={{ span: 2 }} md={{ span: 1 }}></Col>
              <Col xs="4" md="2">
                {!this.state.hide1 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.handleNumberClick(1);
                    }}
                  >
                    1
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide2 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.handleNumberClickAlternative(2);
                    }}
                  >
                    2
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide3 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(3);
                    }}
                  >
                    3
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide4 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(4);
                    }}
                  >
                    4
                  </p>
                )}
              </Col>
              <Col xs="4" md="2">
                {!this.state.hide5 && (
                  <p
                    style={bignumbers}
                    onClick={() => {
                      this.changeNumberState(5);
                    }}
                  >
                    5
                  </p>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Number);