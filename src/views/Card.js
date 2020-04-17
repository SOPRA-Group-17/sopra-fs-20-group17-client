import React from "react";
import Link from "react-router-dom/Link";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import Validation from "../components/validation/Validation"

function creatButton(x, setSimilarF) {
  let Buttons = [];

  for (let i = 1; i <= x; i++) {
    Buttons.push(<Button variant="outline-light" onClick={() => {
      setSimilarF();
    }}>{i}</Button>);
  }
  return Buttons;
}

const Card = ({ hint, nr, totalNr, setSimilar, setInvalid}) => {
  
  const setSimilarF = setSimilar;
  const setInvalidF = setInvalid;
  var invalid = false;

  return (
    
    <div>
      {console.log("re render component")}
      <div class="row justify-content-center">
        <p className="nr">{nr + 1}</p>
      </div>
      <div class="row justify-content-center">
        <p className="card-text">{hint.content}</p>
      </div>
      <div class="row justify-content-center">
        <p className="card-text">Clue is to similar to:</p>
      </div>
      <div class="row justify-content-center">
        <ButtonGroup size="md">{creatButton(totalNr, setSimilarF)}</ButtonGroup>
      </div>
      <div class="row justify-content-center">
        <p className="card-text">Clue is invalid?</p>
      </div>
      <div class="row justify-content-center">

      {!invalid ? (
          <Button
          size="md"
          variant="outline-danger"
          className="button-card"
          
          style={{ marginBottom: "calc(0.5em + 0.2vw)" }}
          onClick={() => {
            invalid = !invalid;
            setInvalidF(hint.token, invalid);   
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
            invalid = !invalid;
            setInvalidF(hint.token, invalid);   
          }}
        >
          NO
        </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
