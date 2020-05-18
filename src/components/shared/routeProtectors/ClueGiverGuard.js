import React from "react";
import { Redirect} from "react-router-dom";


/**
 * checks if a player is a ClueGiver or not
 */
export const ClueGiverGuard = props => {
  
  if (localStorage.getItem("status") == "CLUE_GIVER" ) {
    return props.children;
  }
  else if(localStorage.getItem("token")){
    return <Redirect to={"/dashboard"} />;

  }
  return <Redirect to={"/login"} />;


 
  
};
