import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {sortedCopy, byIndex} from 'utils/mahjong/helper';
import {scoreMove} from 'utils/mahjong/score';
import {discardTile, drawTile, reset} from 'slices/game';

import TileGroup from 'components/TileGroup';
import Tile from 'components/Tile';
import GameOver from 'components/modals/GameOver';

import styles from './Game.module.scss';

export default function Game() {
  const [gameOver, setGameOver] = useState(false);
  const [isTenpai, setIsTenpai] = useState(false);
  const [efficiency, setEfficiency] = useState(0);
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
      setIsTenpai(true);
      return toggleGameOver();
    } else if (results.badMove === 'SHANTEN') {
      efficiency = 0;
    } else if (results.badMove === 'UKEIRE') {
      efficiency = Math.floor(
        (results.player.ukeire / results.ideal.ukeire) * 100
      );
    } else {
      efficiency = 100;
    }
    dispatch(
      discardTile({
        discard: id,
        shanten: results.player.shanten,
        ukeire: results.player.ukeire,
        efficiency,
      })
    );
    setEfficiency(efficiency);
    if (game.wall.length) {
      dispatch(drawTile());
    } else {
      setIsTenpai(false);
      return toggleGameOver();
    }
  }
  return (
    <main className={styles.Game}>
      {gameOver && (
        <GameOver
          toggle={() => <Redirect to="/highscores" />}
          isTenpai={isTenpai}
          ukeire={game.ukeire}
          moveCount={game.moves.length}
          efficiency={efficiency}
        />
      )}
      <header>
        <div className={styles.handInfo}>
          <p>
            {game.shanten !== null && <span>{game.shanten} Shanten </span>}
            {game.ukeire !== null && <span>{game.ukeire} Ukeire </span>}
            {game.efficiency !== null && (
              <span>{game.efficiency}% efficient</span>
            )}
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
      <section className={styles.moves}>
        <h2>Moves</h2>
        {moves.map((move, idx) => (
          <div key={idx} className={styles.move}>
            <TileGroup tiles={sortedCopy(move.hand)} />
            <div className={styles.discard}>
              <Tile id={move.discard} />
            </div>
            <div>
              <p>
                ({move.shanten} Shanten, {move.ukeire} Ukeire)
              </p>
              <p>{move.efficiency}% efficient</p>
            </div>
          </div>
        ))}
      </section>
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
    </main>
  );
}
