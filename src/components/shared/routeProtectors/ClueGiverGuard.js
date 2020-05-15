import React from "react";
import { Redirect, useParams} from "react-router-dom";


/**
 * checks if a player is a ClueGiver or not
 *  if (localStorage.getItem("role") == "ClueGiver" ) {
    return props.children;
  }
  else if(localStorage.getItem("token")){
    return <Redirect to={"/dashboard"} />;

  }
  return <Redirect to={"/login"} />;
 */
export const ClueGiverGuard = props => {
  return props.children;
 
  
};
