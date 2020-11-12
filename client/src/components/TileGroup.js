import React from 'react';

import Tile from './Tile';

import styles from './TileGroup.module.scss';

export default function TileGroup({tiles, clickHandler}) {
  return (
    <div className={styles.TileGroup}>
      {tiles.map((id, idx) => (
        <Tile
          key={idx}
          id={id}
          clickHandler={clickHandler ? () => clickHandler(id) : undefined}
        />
      ))}
    </div>
  );
}
