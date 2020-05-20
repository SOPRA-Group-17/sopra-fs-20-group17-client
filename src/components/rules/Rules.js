import React from "react";
import { Modal } from "react-bootstrap";

class Rules extends React.Component {
  render() {
    return (
      <div>
        {" "}
        <Modal.Header closeButton className="rules-header">
          <Modal.Title id="rules-dashboard-title" className="rules-header">
            Rules
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="rules-text">
          <p className="rules-text-title">Object of the Game</p>
          <p className="rules-text">
          Just One is a cooperative game. You need to work together to get the best score! 
          In each round there is one active player. His goal is to guess the mystery word. 
          He gets some clues from the other players(clue givers) which help him guessing correctly. 
          </p>
          <p className="rules-text-title">Game Overview</p>
          <p className="rules-text">
            One game includes 13 rounds. Each of these is divided into 4 phases.
          </p>
          <p className="rules-text-s-title">Choose the Mystery Word</p>
          <p className="rules-text">
            The guesser chooses a number between 1 and 5. The
            corresponding mystery word gets displayed to
            the clue givers. The clue givers have now the opportunity to
            report whether they know the mystery word or not. If the word is unknown to many players. 
            The guesser has to choose another number and the clue givers have to decide again if they know the word. 
          </p>
          <p className="rules-text-s-title">Clue Section</p>
          <p className="rules-text">
            Each clue giver enters one clue. That clue must be composed of a
            single word.
          </p>
          <p className="rules-text">
            Note: A digit, an acronym, an onomatopoeia, or a special character
            are all considered to be words. Example: 007 is allowed to help
            someone guess Bond, just like Riiiiiinnng or SMS are allowed to help
            someone guess Telephone, and $ is allowed to help someone guess
            America.
          </p>
          <p className="rules-text">
            Invalid clues:
            <ul>
              <li>
              -	The Mystery word but written differently. Example: Shurt is not allowed when the mystery word is Shirt.
              </li>
              <li>
                The Mystery word written in a foreign language. Example: Buisson is not allowed if the word to be guessed is Shrub.
              </li>
              <li>
                A word from the same word family as the Mystery word. Example:
                Princess is not allowed if the word to be guessed is Prince.
              </li>
              <li>
                An invented word. Example: Swee’ting is not allowed to try to
                help someone guess Cake.
              </li>
              <li>
                A word phonetically identical to the Mystery word, but the
                meaning of which is different. Example: Whether is not allowed
                to try to get someone to guess Weather.
              </li>
            </ul>
          </p>
          <p className="rules-text-s-title">Validating Clues</p>
          <p className="rules-text">
            Once all players have submitted their clues, they are validated in
            two steps: First an API cancels all clues that are certainly invalid
            or have been submitted several times. In a second step, all the
            submitted clues are displayed to the clue givers and each one
            can report invalid clues and duplicates. 
            If more than the half of the clue givers choose the same clues to be invalid respectively duplicates, they get deleted. 
          </p>
          <p className="rules-text">
            Identical clues:
            <ul>
              <li>
                Two identical words. Example: Mouse and Mouse are identical.
              </li>
              <li>
                Variants from the same word family. Example: Prince and Princess
                are considered to be identical.
              </li>
              <li>
                Variants of the same word: plurals, gender differentiations, and
                spelling mistakes don’t count as actual differences. Examples:
                Prince and Princes, Actor and Actress, Philosophy and Filosofie
                are identical.
              </li>
            </ul>
          </p>
          <p className="rules-text">
            Note: If all clues have been cancelled, no hints are displayed to
            the active player. Nevertheless, he may submit a guess or just skip
            it.
          </p>
          <p className="rules-text-s-title">Guess</p>
          <p className="rules-text">
            Once the identical or invalid clues have been deleted, all the
            remaining clues are displayed to the guesser. He can now try
            to guess the mystery word. To do so, he is only allowed to submit
            one guess! However, if he has no idea what the mystery word could
            be, he is also allowed to skip the word.
          </p>
          <p className="rules-text">
          Evaluation:
            <ul>
              <li>
                Success: If the active player correctly guesses the mystery
                word, he gets a lot of points (also dependent on how fast he
                guessed it!). Note: Upper and lowercase characters don’t matter.
                 Example: Prince is a correct guess for the mystery word prince. 
              </li>
              <li>
                Failure: If the active player makes a wrong guess, he will get
                minus points and as an additional penalty there will be one
                round less for the team to play.
              </li>
              <li>
                Skip: If the active player chooses not to answer and skips, the guesser gets 0 points and there won't be an additional
                penalty of removing one round.
              </li>
            </ul>
          </p>

          <p className="rules-text-s-title">End of Turn</p>
          <p className="rules-text">
              If the game is not over yet a new round starts with a new player as a guesser.
          </p>
          <p className="rules-text-s-title">Scoring System</p>
          <p className="rules-text">
            Guesser
            <br />
            Gets plus points for a correct guess and minus points for an
            incorrect Guess. He gets more plus or less minus points the faster
            he submits his guess. Skipping gives 0 points.
            <br />
            Clue giver
            <br />
            Gets plus points for a valid clue and minus points for an invalid or
            duplicate clue. He gets more plus or less minus points the faster he
            submits his clue.
          </p>
        </Modal.Body>
      </div>
    );
  }
}

export default Rules;
