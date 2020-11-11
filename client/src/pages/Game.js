import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {sortedCopy, byIndex} from 'utils/mahjong/helper';
import {findDrops, findBestScore} from 'utils/mahjong/score';
import {discardTile, drawTile} from 'slices/game';
import TileGroup from 'components/TileGroup';
import Tile from 'components/Tile';

import styles from './Game.module.scss';

export default function Home() {
  const game = useSelector((state) => state.game);
  const seenTiles = byIndex(game.seenTiles);
  const hand = sortedCopy(game.hand);

  const dispatch = useDispatch();
  function discard(id) {
    const bestScore = findDrops(hand);
    console.log(bestScore);
    dispatch(discardTile(id));
    const userScore = findBestScore(hand);
    console.log(userScore);
    dispatch(drawTile());
  }
  console.log(hand);
  return (
    <main className={styles.Game}>
      <h2>Dora Indicator</h2>
      <Tile id={game.doraIndicators[0]} />
      <h2>Seen Tiles</h2>
      <div className={styles.seenTiles}>
        {seenTiles.map((tile, idx) => (
          <div>
            <Tile id={idx} />
            {tile.length > 1 && <span>x{tile.length}</span>}
          </div>
        ))}
      </div>
      <h2>Hand</h2>
      <TileGroup tiles={hand} clickHandler={discard} />
      <h2>Moves</h2>
      {game.moves.map(({hand, discard}) => (
        <div>
          <TileGroup tiles={hand} />
          <Tile id={discard} />
        </div>
      ))}
    </main>
  );
}
