import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api, handleError } from "../../helpers/api";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import Link from "react-router-dom/Link";
import logo from "../styling/JustOne_logo_white.svg";
import { Button } from "react-bootstrap";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(42, 33, 79), rgb(30, 18, 43));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Register extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
<<<<<<< HEAD
      password: null,
      confirmedPassword: null,
      passwordHidden: true
=======
      password: null
>>>>>>> devJonas
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async register() {
    try {
<<<<<<< HEAD
      // checks whether password and confirmedPassword are matching and if so, sets passwordMatch to true
      var passwordMatch =
        this.state.password == this.state.confirmedPassword ? true : false;

      // post request is only done if the passwords are matching
      if (passwordMatch == true) {
        const requestBody = JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          confirmedPassword: this.state.confirmedPassword
        });
        const response = await api.post("/users", requestBody);

        // Get the returned user and update a new object.
        const user = new User(response.data);

        // Login successfully worked --> navigate to the route /game in the GameRouter, why doesnt this work
        this.props.history.push(`/Login`);
      } else {
        alert(
          "Password and confirmed password do not match. Please try again."
        );
      }
=======
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Login successfully worked --> navigate to the route /game in the GameRouter, why doesnt this work
      this.props.history.push(`/Login`);
>>>>>>> devJonas
    } catch (error) {
      alert(
        `Something went wrong during the login, probably:  \n${handleError(
          error
        )}`
      );
      this.props.history.push(`/Register`);
<<<<<<< HEAD
    }
  }

  showOrHidePassword(key) {
    if (this.state.passwordHidden) {
      this.setState({ [key]: false });
    } else {
      this.setState({ [key]: true });
=======
>>>>>>> devJonas
    }
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <BaseContainer>
<<<<<<< HEAD
=======
        <Label>SOPRA GROUP 17: Janosch, Jonas, Markus, Lennart, Domenic</Label>
>>>>>>> devJonas
        <img className="logoImg" src={logo} alt="Just One Logo"></img>
        <FormContainer>
          <Form>
            <Label>Username</Label>
            <InputField
              placeholder="Enter here... "
              onChange={e => {
                this.handleInputChange("username", e.target.value);
              }}
            />
            <Label> Password</Label>
            <InputField
              placeholder="Enter here..."
<<<<<<< HEAD
              type={this.state.passwordHidden ? "password" : "text"}
=======
>>>>>>> devJonas
              onChange={e => {
                this.handleInputChange("password", e.target.value);
              }}
            />
<<<<<<< HEAD
            <Label> Confirm Password</Label>
            <InputField
              placeholder="Enter here..."
              type={this.state.passwordHidden ? "password" : "text"}
              onChange={e => {
                this.handleInputChange("confirmedPassword", e.target.value);
              }}
            />
            {this.state.passwordHidden ? (
              <ButtonContainer>
                <Button
                  variant="outline-info"
                  style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  onClick={() => {
                    this.showOrHidePassword("passwordHidden");
                  }}
                >
                  Show Password
                </Button>
              </ButtonContainer>
            ) : (
              <ButtonContainer>
                <Button
                  variant="outline-info"
                  style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  onClick={() => {
                    this.showOrHidePassword("passwordHidden");
                  }}
                >
                  Hide Password
                </Button>
              </ButtonContainer>
            )}
=======
>>>>>>> devJonas
            <ButtonContainer>
              <Button
                variant="outline-info"
                style={{ paddingLeft: "25px", paddingRight: "25px" }}
<<<<<<< HEAD
                disabled={
                  !this.state.username ||
                  !this.state.password ||
                  !this.state.confirmedPassword
                }
=======
                disabled={!this.state.username || !this.state.password}
>>>>>>> devJonas
                onClick={() => {
                  this.register();
                }}
              >
                Register
              </Button>
            </ButtonContainer>
          </Form>
        </FormContainer>
        <ButtonContainer>
          <Button variant="outline-light">
            <Link
              to="/Login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Link>
          </Button>
        </ButtonContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 *
 * What does this do, do i need to change anywhere else too?
 */
export default withRouter(Register);
