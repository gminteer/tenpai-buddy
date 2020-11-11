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
  for (let i = 0; i < 14; i++) {
    hand.push(wall.pop());
  }
  const seenTiles = [];
  seenTiles.push(doraIndicators[0]);
  seenTiles.push(...hand);
  const moves = [];
  return {wall, doraIndicators, deadTiles, hand, seenTiles, moves};
}

const reducers = {
  discardTile(state, {payload}) {
    state.hand = state.hand.filter((tile) => tile !== payload);
    state.moves.push({discard: payload, hand: [...state.hand]});
  },
  drawTile(state) {
    const newTile = state.wall.pop();
    state.hand.push(newTile);
    state.seenTiles.push(newTile);
  },
};

const slice = createSlice({
  name: 'game',
  initialState: initialState(),
  reducers,
});

export const {discardTile, drawTile} = slice.actions;
export default slice.reducer;
