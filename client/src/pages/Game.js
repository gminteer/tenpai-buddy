import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {sortedCopy, byIndex} from 'utils/mahjong/helper';
import {scoreMove} from 'utils/mahjong/score';
import {discardTile, drawTile} from 'slices/game';
import TileGroup from 'components/TileGroup';
import Tile from 'components/Tile';

import styles from './Game.module.scss';

export default function Home() {
  const game = useSelector((state) => state.game);
  const seenTiles = byIndex(game.seenTiles);

  const dispatch = useDispatch();
  function discard(id) {
    const results = scoreMove(
      sortedCopy([...game.hand, game.drawnTile]),
      id,
      seenTiles
    );
    dispatch(discardTile(id));
    dispatch(drawTile());
  }
  return (
    <main className={styles.Game}>
      <h2>Dora Indicator</h2>
      <Tile id={game.doraIndicators[0]} />
      <h2>Seen Tiles</h2>
      <div className={styles.seenTiles}>
        {seenTiles.map((tile, idx) => (
          <div className={styles.tileCounter}>
            <Tile key={tile} id={idx} />
            {tile.length > 1 && <span>x{tile.length}</span>}
          </div>
        ))}
      </div>
      <h2>Hand</h2>
      <div className={styles.hand}>
        <TileGroup tiles={sortedCopy(game.hand)} clickHandler={discard} />
        <div className={styles.drawn}>
          <Tile
            id={game.drawnTile}
            clickHandler={() => discard(game.drawnTile)}
          />
        </div>
      </div>
      <h2>Moves</h2>
      {game.moves.map(({hand, discard}) => (
        <div className={styles.moves}>
          <TileGroup tiles={sortedCopy(hand)} />
          <div className={styles.discard}>
            <Tile id={discard} />
          </div>
        </div>
      ))}
    </main>
  );
}
