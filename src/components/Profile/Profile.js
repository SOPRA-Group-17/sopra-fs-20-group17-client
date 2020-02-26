import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import user from "../shared/models/User";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

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
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: white;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 50px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  pointer-events:none;
`;
const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: new user(),
            ID: null
        };
    }

    async componentDidMount() {
        try {
            this.state.ID = this.props.match.params.id;
            const response = await api.get(`/users/${this.state.ID}`);
            // delays continuous execution of an async operation for 1 second.
            // This is just a fake async call, so that the spinner can be displayed
            // feel free to remove it :)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            this.setState({ user: response.data[0] });

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }
    dashboard(){
        this.props.history.push('/game/dashboard');
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder={this.state.user.username}
                            />
                        <Label>Name</Label>
                        <InputField
                            placeholder={this.state.user.name}
                        />
                        <Label>ID</Label>
                        <InputField
                            placeholder={this.state.user.id}
                        />
                        <Label>date</Label>
                        <InputField
                            placeholder={this.state.user.date}
                        />
                    </Form>
                </FormContainer>
                <Button
                    width="100%"
                    margin-top="100px"
                    onClick={() => {
                        this.dashboard();
                    }}
                >
                    Return to Dashboard
                </Button>

            </BaseContainer>


        );
    }
}

export default withRouter(Profile);