import React from 'react';

export default function HighScores() {
  return (
    <main>
      <h1>High Scores</h1>
      <ol>
        {[...Array(10).keys()].map((i) => (
          <li>{i}</li>
        ))}
      </ol>
    </main>
  );
}
