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
  const shanten = null;
  const ukeire = null;
  const efficiency = null;

  return {
    wall,
    doraIndicators,
    deadTiles,
    hand,
    drawnTile,
    seenTiles,
    moves,
    shanten,
    ukeire,
    efficiency,
  };
}

const reducers = {
  discardTile(state, {payload}) {
    const {discard, shanten, ukeire, efficiency} = payload;
    // add drawn tile to hand if a different tile was discarded
    if (discard !== state.drawnTile) {
      state.hand = state.hand.filter((tile) => tile !== discard);
      state.hand.push(state.drawnTile);
    }
    state.shanten = shanten;
    state.ukeire = ukeire;
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
