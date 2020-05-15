import React from "react";
import { Modal, Button } from "react-bootstrap";

class EndGame extends React.Component {
  render() {
    return (
      <div>
        {" "}
       
          <Modal.Header closeButton className="rules-header">
            <Modal.Title id="rules-dashboard-title" className="rules-header">
              End Game
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="rules-text">
              <p className="rules-text">
              Are you sure that you want to end the game? This will end the game for all players.
            </p>
            <Button
                    variant="outline-danger"
                    className="outlineWhite-Dashboard"
                    onClick={() => this.endGame()}
                  >
                    YES
             </Button>
             

            
          </Modal.Body>
          
       
      </div>
    );
  }
}

export default EndGame;
