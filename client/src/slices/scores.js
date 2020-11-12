import {createSlice} from '@reduxjs/toolkit';

const initialState = [];

const reducers = {
  addScore(state, {payload}) {
    state.push(payload);
  },
  bulkUpdate(state, {payload}) {
    return payload;
  },
};

const slice = createSlice({
  name: 'scores',
  initialState,
  reducers,
});

export const {addScore, bulkUpdate} = slice.actions;
export default slice.reducer;
