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
  width: 100%;
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
  height: 50px;
  width: 100%;
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

    dashboard(){
        this.props.history.push('/game/dashboard');
    }

    //this method is used to format the saved BirthDate into a nice format ;)
    getBirthDate(){
        if(this.state.user.birthDate == null){
            return "Birth date is not set"
        }
        else{
            console.log(this.state.user.birthDate);
            let niceFormat = this.state.user.birthDate.toString();
            niceFormat = niceFormat.slice(0,10);
            return niceFormat;

        }
    }
    editProfile(){
        this.props.history.push(`/game/editProfile/${this.state.user.id}`);
    }


    render() {
        return (
            <BaseContainer>
                <Button
                    width="100%"
                    onClick={() => {
                        this.editProfile();
                    }}
                >
                    Edit Profile
                </Button>
                <FormContainer>
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder={this.state.user.username}
                            />
                        <Label>Online Status</Label>
                        <InputField
                            placeholder={this.state.user.status}
                        />
                        <Label>ID</Label>
                        <InputField
                            placeholder={this.state.user.id}
                        />
                        <Label>Creation date</Label>
                        <InputField
                            placeholder={this.state.user.date}
                        />
                        <Label>Birth date</Label>
                        <InputField

                            placeholder= {this.getBirthDate()}
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