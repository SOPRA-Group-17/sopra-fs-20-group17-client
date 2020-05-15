import React from "react";
import { Redirect, useParams} from "react-router-dom";


/**
 * checks if a player is a ClueGiver or not
 *   if (localStorage.getItem("role") == "Guesser") {
    return props.children;
  }
  else if(localStorage.getItem("token")){
    return <Redirect to={"/dashboard"} />;
 */
export const GuesserGuard = props => {
  return props.children;
  
 
  
};
