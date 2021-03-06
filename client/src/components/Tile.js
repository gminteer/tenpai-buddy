import React from 'react';

import {faces, back} from 'assets/tiles';

import {tile} from 'utils/mahjong/helper';
import styles from './Tile.module.scss';

export default function Tile({id, clickHandler}) {
  return (
    <div className={styles.Tile} onClick={clickHandler}>
      <img
        src={id === 'back' ? back : faces[id % 40]}
        alt={tile.toString(id)}
      />
    </div>
  );
}
