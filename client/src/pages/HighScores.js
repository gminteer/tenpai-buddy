import React, {useEffect} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {useSelector, useDispatch} from 'react-redux';

import idbPromise from 'utils/idb';
import {GET_SCORES} from 'utils/queries';
import {bulkUpdate} from 'slices/scores';

import styles from './HighScores.module.scss';

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
        dispatch(bulkUpdate(scores))
      );
    }
  });

  if (loading) return <div>Loading...</div>;
  return (
    <main className={styles.HighScores}>
      <h2>High Scores</h2>
      <table>
        <thead>
          <th>User</th>
          <th>Moves</th>
          <th>Efficiency</th>
          <th>Final ukeire</th>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score._id}>
              <td>{score.profile?.username || 'Freed Jyanshi'}</td>
              <td>{score.moveCount}</td>
              <td>{score.efficiency}</td>
              <td>{score.ukeire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
