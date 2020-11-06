import {createSlice} from '@reduxjs/toolkit';

const initialState = 42;

const reducers = {
  change(state, {payload}) {
    return payload;
  },
};

const sliceSlice = createSlice({
  name: 'slice',
  initialState,
  reducers,
});

export const {change} = sliceSlice.actions;
export default sliceSlice.reducer;
