import React from "react";
import Link from "react-router-dom/Link";
import {Container} from "react-bootstrap"


const Lobby = ({ game }) => {
    return (
        <option>{game.name}</option>
    );
  };
  
  export default Lobby;