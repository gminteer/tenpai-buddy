import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from '@apollo/react-hooks';

import Auth from 'utils/auth';
import idbPromise from 'utils/idb';
import {ADD_SCORE} from 'utils/mutations';
import {addScore} from 'slices/scores';

import Modal from './Modal';

export default function GameOver({
  toggle,
  isTenpai,
  ukeire,
  moveCount,
  efficiency,
}) {
  const [addScoreMutation, {error}] = useMutation(ADD_SCORE);
  const dispatch = useDispatch();
  const me = useSelector((state) => state.me);
  useEffect(() => {
    const score = {};
    score.profile = me.profile || null;
    score.moveCount = moveCount;
    score.ukeire = ukeire;
    score.efficiency = efficiency;
    async function submitScore() {
      try {
        const {profile, ...scoreVariables} = score;
        const {data} = await addScoreMutation({
          variables: {score: scoreVariables},
        });
        console.log(data);
        idbPromise('scores', 'put', {
          ...score,
          _id: data.addScore._id,
          profile: me.profile,
        });
      } catch (error) {
        console.error(error);
      }
    }
    dispatch(addScore(score));
    submitScore();
  }, [addScoreMutation, dispatch, moveCount, ukeire, efficiency, me.profile]);

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
