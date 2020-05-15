import React from "react";
import { Redirect, useParams} from "react-router-dom";


/**
 * checks if a player is a ClueGiver or not
 */
export const GuesserGuard = props => {
  
  if (localStorage.getItem("role") == "Guesser") {
    return props.children;
  }
  else if(localStorage.getItem("token")){
    return <Redirect to={"/dashboard"} />;

  }
  return <Redirect to={"/login"} />;
  
};
