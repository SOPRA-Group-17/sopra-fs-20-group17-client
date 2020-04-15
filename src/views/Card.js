import React, { useState } from "react";
import Link from "react-router-dom/Link";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import Validation from "../components/validation/Validation"

function creatButton(x) {
  let Buttons = [];

  for (let i = 1; i <= x; i++) {
    Buttons.push(<Button variant="outline-light" onClick={() => {
      Validation.setState();
    }}>{i}</Button>);
  }
  return Buttons;
}

const Card = ({ hint, nr, totalNr }) => {
  {
    console.log(hint);
  }
  {
    console.log(nr);
  }
  {
    console.log(totalNr);
  }
  return (
    <div>
      <div class="row justify-content-center">
        <p className="nr">{nr + 1}</p>
      </div>
      <div class="row justify-content-center">
        <p className="card-text">{hint}</p>
      </div>
      <div class="row justify-content-center">
        <p className="card-text">Clue is to similar to:</p>
      </div>
      <div class="row justify-content-center">
        <ButtonGroup size="md">{creatButton(totalNr)}</ButtonGroup>
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
    </div>
  );
};

export default Card;
