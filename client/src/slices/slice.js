import {createSlice} from '@reduxjs/toolkit';

const initialState = 42;

const reducers = {
  change(state, {payload}) {
    return payload;
  },
};

const slice = createSlice({
  name: 'slice',
  initialState,
  reducers,
});

export const {change} = slice.actions;
export default slice.reducer;
