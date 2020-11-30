import {createSlice} from '@reduxjs/toolkit';

import {createTileList} from 'utils/mahjong/helper';

function initialState() {
  const wall = createTileList();

  const doraIndicators = [];
  for (let i = 0; i < 10; i++) {
    doraIndicators.push(wall.pop());
  }

  const deadTiles = [];
  for (let i = 0; i < 4; i++) {
    deadTiles.push(wall.pop());
  }

  const hand = [];
  for (let i = 0; i < 13; i++) {
    hand.push(wall.pop());
  }
  const drawnTile = wall.pop();

  const seenTiles = [];
  seenTiles.push(doraIndicators[0]);
  seenTiles.push(...hand, drawnTile);

  const moves = [];
  const efficiency = null;

  return {
    wall,
    doraIndicators,
    deadTiles,
    hand,
    drawnTile,
    seenTiles,
    moves,
    efficiency,
  };
}

/**
 * @typedef {Object} Move
 * @property {number} discard - id of discarded tile
 * @property {number} shanten - the shanten of the result
 * @property {Array<number>} ukeireTiles - ukeire tile indexes
 * @property {number} ukeireCount - count of live ukeire tiles
 */
const reducers = {
  discardTile(state, {payload}) {
    // player and ideal are Moves, don't know enough JSDoc to express it that way.
    // Ideally, I'm going to refactor this whole thing into TypeScript sooner or later
    const {player, ideal, efficiency} = payload;
    // add drawn tile to hand if a different tile was discarded
    if (player.discard !== state.drawnTile) {
      state.hand = state.hand.filter((tile) => tile !== player.discard);
      state.hand.push(state.drawnTile);
    }
    state.player = player;
    state.ideal = ideal;
    state.efficiency = state.efficiency
      ? Math.floor((state.efficiency + efficiency) / 2)
      : efficiency;
    state.moves.push({...payload, hand: [...state.hand]});
  },
  drawTile(state) {
    const newTile = state.wall.pop();
    state.drawnTile = newTile;
    state.seenTiles.push(newTile);
  },
  reset(state) {
    return initialState();
  },
};

const slice = createSlice({
  name: 'game',
  initialState: initialState(),
  reducers,
});

export const {discardTile, drawTile, reset} = slice.actions;
export default slice.reducer;
