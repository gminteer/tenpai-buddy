import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_SCORES} from 'utils/queries';

export default function HighScores() {
  const {loading, data} = useQuery(GET_SCORES);
  if (loading) return <div>Loading...</div>;
  console.log(data);
  return (
    <main>
      <h1>High Scores</h1>
      <ol>
        {data.scores.map((score) => (
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
