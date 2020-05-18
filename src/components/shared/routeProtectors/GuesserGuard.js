import React from "react";
import { Redirect} from "react-router-dom";


/**
 * checks if a player is a Guesser or not
 */
export const GuesserGuard = props => {
  
  if (localStorage.getItem("status") == "GUESSER") {
    return props.children;
  }
  else if(localStorage.getItem("token")){
    return <Redirect to={"/dashboard"} />;
  }

 
  
};
