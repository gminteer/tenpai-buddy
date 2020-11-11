import {createSlice} from '@reduxjs/toolkit';

const initialState = [];

const reducers = {
  addScore(state, {payload}) {
    state.push(payload);
  },
};

const slice = createSlice({
  name: 'scores',
  initialState,
  reducers,
});

export const {addScore} = slice.actions;
export default slice.reducer;
