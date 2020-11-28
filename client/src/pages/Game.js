import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {sortedCopy, byIndex} from 'utils/mahjong/helper';
import scoreMove from 'utils/mahjong/scoreTileEfficiency';
import {discardTile, drawTile} from 'slices/game';

import TileGroup from 'components/TileGroup';
import Tile from 'components/Tile';
import GameOver from 'components/modals/GameOver';

import styles from './Game.module.scss';

function ukeireTiles(tiles, count) {
  return (
    <span>
      <TileGroup tiles={tiles} /> ({count} tiles)
    </span>
  );
}

function explanation(move) {
  if (!move || !move.ideal) return <></>;
  if (
    move.ideal.shanten >= move.player.shanten &&
    move.ideal.ukeireCount <= move.player.ukeireCount
  )
    return (
      <span>
        Hand improved by{' '}
        {ukeireTiles(move.player.ukeireTiles, move.player.ukeireCount)}.
      </span>
    );
  else if (move.ideal.shanten < move.player.shanten) {
    return (
      <span>
        Discarding <Tile id={move.ideal.discard} /> would have resulted in{' '}
        {move.ideal.shanten} shanten, improved by{' '}
        {ukeireTiles(move.ideal.ukeireTiles, move.ideal.ukeireCount)}
        Your move: {move.player.shanten} shanten, improved by
        {ukeireTiles(move.player.ukeireTiles, move.player.ukeireCount)}.
      </span>
    );
  } else if (move.ideal.ukeireCount > move.player.ukeireCount) {
    return (
      <span>
        Discarding <Tile id={move.ideal.discard} /> would result in hand
        improved by{' '}
        {ukeireTiles(move.ideal.ukeireTiles, move.ideal.ukeireCount)}. Your move
        improved by{' '}
        {ukeireTiles(move.player.ukeireTiles, move.player.ukeireCount)}
      </span>
    );
  }
}
export default function Game() {
  const [gameOver, setGameOver] = useState(false);

  const toggleGameOver = () => setGameOver(!gameOver);

  const game = useSelector((state) => state.game);

  const seenTiles = byIndex(game.seenTiles);
  const moves = [...game.moves].reverse();

  const dispatch = useDispatch();
  function discard(id) {
    const results = scoreMove(
      sortedCopy([...game.hand, game.drawnTile]),
      id,
      seenTiles
    );
    let efficiency = null;
    if (results.gameOver) {
      dispatch(discardTile({player: results.player, efficiency}));
      return toggleGameOver();
    } else if (results.badMove === 'SHANTEN') {
      efficiency = 0;
    } else if (results.badMove === 'UKEIRE') {
      efficiency = Math.floor(
        (results.player.ukeireCount / results.ideal.ukeireCount) * 100
      );
    } else {
      efficiency = 100;
    }
    dispatch(
      discardTile({
        player: results.player,
        ideal: results.ideal,
        efficiency,
      })
    );
    if (game.wall.length) {
      dispatch(drawTile());
    } else {
      return toggleGameOver();
    }
  }
  return (
    <main className={styles.Game}>
      {gameOver && (
        <GameOver toggle={() => window.location.assign('/highscores')} />
      )}
      <header>
        <div className={styles.handInfo}>
          <p>
            {game.player?.shanten && (
              <span>{game.player.shanten} Shanten </span>
            )}
            {game.player?.ukeireCount && (
              <span>{game.player.ukeireCount} Ukeire </span>
            )}
            {game.efficiency && <span>{game.efficiency}% efficient</span>}
          </p>
        </div>
        <div className={styles.dora}>
          <TileGroup
            tiles={[game.doraIndicators[0], 'back', 'back', 'back', 'back']}
          />
          <h2>Dora</h2>
        </div>
      </header>
      <h2>Seen Tiles</h2>
      <div className={styles.seenTiles}>
        {seenTiles.map((tile, idx) => (
          <div className={styles.tileCounter} key={tile}>
            <Tile key={tile} id={idx} />
            {tile.length > 1 && <span>x{tile.length}</span>}
          </div>
        ))}
      </div>
      <section className={styles.hand}>
        <h2>Your Hand</h2>
        <aside>click / tap to discard</aside>
        <div className={styles.tileSet}>
          <TileGroup tiles={sortedCopy(game.hand)} clickHandler={discard} />
          <div className={styles.drawn}>
            <Tile
              id={game.drawnTile}
              clickHandler={() => discard(game.drawnTile)}
            />
          </div>
        </div>
      </section>
      <section className={styles.moves}>
        <h2>Moves</h2>
        {moves.map((move, idx) => (
          <div key={idx} className={styles.move}>
            <TileGroup tiles={sortedCopy(move.hand)} />
            <div className={styles.discard}>
              <Tile id={move.player.discard} />
            </div>
            <div>
              <span>
                ({move.player.shanten} Shanten, {move.player.ukeireCount}{' '}
                Ukeire)
              </span>
              <span>
                {move.efficiency}% efficient {explanation(move)}
              </span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
