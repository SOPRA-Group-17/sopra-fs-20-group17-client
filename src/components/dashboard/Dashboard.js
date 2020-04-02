import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import logo from "../styling/JustOne_logo_white.svg";




class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
          Games: ["1","2", "3"],
        };
      }
/*
async componentDidMount() {
    try {
    }

    catch(error){

    }
}*/


render() {
    return (
        <Container fluid>
            <Row>
                <Col xs sm md lg xl = "2">
                <img className="logoImgSmall" src={logo} alt="Just One Logo" >
                    </img>
                </Col>
                <Col xs sm md lg xl = {{span:1, offset:9}}>
                    <Button variant= "outline-light" className = "outlineWhite-Dashboard" >
                            Edit Profil
                    </Button>
                    
                </Col>
            </Row>
            <Row>
                <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Example select</Form.Label>
                    <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    </Form.Control>
            </Form.Group>

                </Form>
                
            </Row>

        </Container>


    );
}
}

export default withRouter(Dashboard);