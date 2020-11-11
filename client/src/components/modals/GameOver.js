import React from 'react';

import Modal from './Modal';

export default function GameOver({toggle, isTenpai, ukeire, moveCount}) {
  return (
    <Modal toggle={toggle} title="Game Over">
      {isTenpai ? (
        <div>
          <h2>Congratulations!</h2>
          <p>
            You reached tenpai after {moveCount} moves. There are {ukeire} tiles
            remaining to complete your hand.
          </p>
        </div>
      ) : (
        <div>
          <h2>Better luck next time!</h2>
          <p>You ran out of tiles.</p>
        </div>
      )}
    </Modal>
  );
}
