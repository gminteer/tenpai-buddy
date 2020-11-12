import React, {useEffect} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {useSelector, useDispatch} from 'react-redux';

import idbPromise from 'utils/idb';
import {GET_SCORES} from 'utils/queries';
import {bulkUpdate} from 'slices/scores';

export default function HighScores() {
  const scores = useSelector((state) => state.scores);
  const dispatch = useDispatch();
  const {loading, data} = useQuery(GET_SCORES);

  useEffect(() => {
    if (data) {
      data.scores.forEach((score) => idbPromise('scores', 'put', score));
      dispatch(bulkUpdate(data.scores));
    } else if (!loading) {
      idbPromise('scores', 'get').then((scores) =>
        dispatch(bulkUpdate(data.scores))
      );
    }
  });

  if (loading) return <div>Loading...</div>;
  return (
    <main>
      <h1>High Scores</h1>
      <ol>
        {scores.map((score) => (
          <li key={score._id}>
            <span>{score.profile.username}</span>
            <span>{score.moveCount}</span>
            <span>{score.efficiency}</span>
            <span>{score.ukeire}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
