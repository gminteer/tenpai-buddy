import {createSlice} from '@reduxjs/toolkit';

const initialState = {_id: null, email: '', profile: {_id: null, username: ''}};

const reducers = {
  update(state, {payload}) {
    return payload;
  },
};

const slice = createSlice({
  name: 'me',
  initialState,
  reducers,
});

export const {update} = slice.actions;
export default slice.reducer;
