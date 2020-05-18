import React from "react";
import styled from "styled-components";
import { api, handleError } from "../../helpers/api";
import Rules from "../rules/Rules";
import { withRouter } from "react-router-dom";
import user from "../shared/models/User";
import User from "../shared/models/User";
import { Container, Row, Col, Modal, Button, Badge } from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";

import "react-datepicker/dist/react-datepicker.css";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 400px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  margin-button: 20px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: white;
  }
  height: 50px;
  width: 100%;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 50px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: #a363eb;
`;
const OutputField = styled.input`
  &::placeholder {
    color: ##1c81d4;
  }
  height: 50px;
  width: 100%;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 50px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  pointer-events: none;
`;
const Label = styled.label`
  color: white;

  margin-bottom: 10px;
  text-transform: uppercase;
`;

class EditProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: new user(),
      ID: null,
      newUsername: null,
      currentPassword: null,
      birthDate: null,
      rules: false,
      passwordScreen: false, //has to be false
      passwordValidation: false, // has to be false
      newPassword: null,
      confirmPassword: null,
      passwordConfirmationSuccessful: false, //has to be false
      passwordHidden: true,
      triedToValidatePasswordUnsuccessful: false,
      changedUsername: false,
    };
  }

  async componentDidMount() {
    try {
      this.state.ID = this.props.match.params.userId;
      console.log(this.state.ID);
      const response = await api.get(`/users/${this.state.ID}`);

      console.log(response.data);
      // Get the returned users and update the state.
      this.setState({ user: response.data });
      console.log(this.state.ID);
      console.log(this.state.user);
    } catch (error) {
      alert(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
    }
  }

  async saveChangeUsername() {
    try {
      let requestBody;
      if (this.state.newUsername != null) {
        requestBody = JSON.stringify({
          username: this.state.newUsername,
        });
      }
      console.log(requestBody);
      const response = await api.put(`/users/${this.state.ID}`, requestBody);
      console.log(response.data);
      this.setState({
        changedUsername: true,
      });
      // Get the returned user and update a new object.
      const user = new User(response.data);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
      this.props.history.push(`/Register`);
    }
  }
  async saveChangePassword() {
    try {
      //update the password
      let requestBody;
      requestBody = JSON.stringify({
        password: this.state.newPassword,
      });
      console.log(requestBody);
      const response = await api.put(`/users/${this.state.ID}`, requestBody);
      console.log(response);
    } catch (error) {
      alert(
        `Something went wrong during updating your data: \n${handleError(
          error
        )}`
      );
    }
  }

  dashboard() {
    this.props.history.push("/dashboard");
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  handleChange = (date) => {
    this.setState({
      birthDate: date,
    });
    console.log(this.state.birthDate);
  };

  getBirthDate() {
    if (this.state.user.birthDate == null) {
      return "Birth date is not set";
    } else {
      return this.state.user.birthDate;
    }
  }

  async checkPassword() {
    if (this.state.currentPassword) {
      //get request to the backend, check if the password is correct
      //if correct then set passwordValidation true
      //post request mit pw im req body
      //response ? user : null
      try {
        let requestBody;

        requestBody = JSON.stringify({
          password: this.state.currentPassword,
        });

        console.log(requestBody);
        const response = await api.post(
          `/users/${this.state.ID}/passwords`,
          requestBody
        );
        console.log(response.data.id);
        if (response.data.id) {
          this.setState({
            passwordValidation: true,
          });
        } else {
          this.setState({
            passwordValidation: false,
            triedToValidatePasswordUnsuccessful: true,
          });
        }
        // Get the returned user and update a new object.
        new User(response.data);
      } catch (error) {
        alert(
          `Something went wrong during updating your data: \n${handleError(
            error
          )}`
        );
        this.props.history.push(`/Register`);
      }
    }
  }

  confirmPassword() {
    if (this.state.confirmPassword && this.state.newPassword) {
      if (this.state.confirmPassword === this.state.newPassword) {
        //update Password
        this.saveChangePassword();
        this.setState({
          passwordConfirmationSuccessful: true,
        });
      }
    }
  }

  editUsername() {
    this.setState({
      passwordScreen: false,
      passwordValidation: false,
      passwordConfirmationSuccessful: false,
      triedToValidatePasswordUnsuccessful: false,
    });
  }

  showOrHidePassword() {
    if (this.state.passwordHidden) {
      this.setState({ passwordHidden: false });
    } else {
      this.setState({ passwordHidden: true });
    }
  }

  render() {
    return (
      <Container fluid>
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
                  onClick={() => {
                    this.dashboard();
                  }}
                >
                  Return to Dashboard
                </Button>
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => this.setState({ rules: true })}
                >
                  Rules
                </Button>
              </Row>
            </Col>
          </Row>
          <Modal
            size="lg"
            show={this.state.rules}
            onHide={() => this.setState({ rules: false })}
            aria-labelledby="rules-dashboard"
          >
            <Rules />
          </Modal>

          {!this.state.passwordScreen ? (
            <div>
              <Col
                xs={{ span: 10, offset: 1 }}
                md={{ span: 6, offset: 3 }}
                lg={{ span: 4, offset: 4 }}
              >
                <Label>ID</Label>
                <OutputField placeholder={this.state.user.id} />
                <Label>Username</Label>
                <InputField
                  placeholder={this.state.user.username}
                  onChange={(e) => {
                    this.handleInputChange("newUsername", e.target.value);
                  }}
                />
                {this.state.changedUsername ? (
                  <Badge pill variant="success" style={{ marginTop: "1vw" }}>
                    the username was changed succesfully
                  </Badge>
                ) : (
                  <p> </p>
                )}
                <Button
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => this.setState({ passwordScreen: true })}
                >
                  Edit password
                </Button>
                <Button
                  disabled={!this.state.newUsername}
                  variant="outline-light"
                  className="outlineWhite-Dashboard"
                  onClick={() => {
                    this.saveChangeUsername();
                  }}
                >
                  Save username
                </Button>
              </Col>
            </div>
          ) : (
            <div>
              {this.state.passwordValidation ? (
                <Row style={{ marginTop: "2vw" }}>
                  <Col
                    xs={{ span: 11, offset: 0 }}
                    md={{ span: 9, offset: 3 }}
                    lg={{ span: 6, offset: 3 }}
                  >
                    <Label>new Password</Label>
                    <InputField
                      type={this.state.passwordHidden ? "password" : "text"}
                      placeholder={"Enter here..."}
                      onChange={(e) => {
                        this.handleInputChange("newPassword", e.target.value);
                      }}
                    />
                    <Label>confirm Password</Label>
                    <InputField
                      type={this.state.passwordHidden ? "password" : "text"}
                      placeholder={"Enter here..."}
                      onChange={(e) => {
                        this.handleInputChange(
                          "confirmPassword",
                          e.target.value
                        );
                      }}
                    />
                    <Button
                      variant="outline-light"
                      className="outlineWhite-Dashboard"
                      onClick={() => {
                        this.confirmPassword();
                      }}
                    >
                      confirm new password
                    </Button>
                    <Button
                      variant="outline-light"
                      className="outlineWhite-Dashboard"
                      onClick={() => {
                        this.showOrHidePassword();
                      }}
                    >
                      show Password
                    </Button>
                    <Button
                      variant="outline-light"
                      className="outlineWhite-Dashboard"
                      onClick={() => {
                        this.editUsername();
                      }}
                    >
                      editUsername
                    </Button>
                    {this.state.passwordConfirmationSuccessful ? (
                      <Badge
                        pill
                        variant="success"
                        style={{ marginTop: "1vw" }}
                      >
                        the password was changed succesfully
                      </Badge>
                    ) : (
                      <p> </p>
                    )}
                  </Col>
                </Row>
              ) : (
                <Col
                  xs={{ span: 11, offset: 0 }}
                  md={{ span: 7, offset: 2 }}
                  lg={{ span: 5, offset: 3 }}
                >
                  <Label>current Password</Label>
                  <InputField
                    type={this.state.passwordHidden ? "password" : "text"}
                    placeholder={"Enter here..."}
                    onChange={(e) => {
                      this.handleInputChange("currentPassword", e.target.value);
                    }}
                  />
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => {
                      this.checkPassword();
                    }}
                  >
                    check password
                  </Button>

                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => {
                      this.editUsername();
                    }}
                  >
                    editUsername
                  </Button>
                  <Button
                    variant="outline-light"
                    className="outlineWhite-Dashboard"
                    onClick={() => {
                      this.showOrHidePassword();
                    }}
                  >
                    show Password
                  </Button>
                  {this.state.triedToValidatePasswordUnsuccessful ? (
                    <Badge pill variant="danger" style={{ marginTop: "1vw" }}>
                      the password is wrong try again
                    </Badge>
                  ) : (
                    <p> </p>
                  )}
                </Col>
              )}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(EditProfile);
