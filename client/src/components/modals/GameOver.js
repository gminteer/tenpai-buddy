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
  const game = useSelector((state) => state.game);

  useEffect(() => {
    const score = {};
    score.profile = me.profile || null;
    score.moveCount = game.moves.length;
    score.ukeire = game.player.ukeireCount;
    score.efficiency = game.efficiency;
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
  }, [addScoreMutation, dispatch, game, me.profile]);

  return (
    <Modal toggle={toggle} title="Game Over">
      {game.wall.length ? (
        <div>
          <h2>Congratulations!</h2>
          <p>
            You reached tenpai after {game.moves.length} moves. There are{' '}
            {game.player.ukeireCount} tiles remaining to complete your hand.
          </p>
        </div>
      ) : (
        <div>
          <h2>Better luck next time!</h2>
          <p>
            You ran out of tiles at {game.player.shanten} shanten,{' '}
            {game.player.ukeireCount} ukeire.
          </p>
        </div>
      )}
    </Modal>
  );
}
