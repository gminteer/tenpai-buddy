import {configureStore} from '@reduxjs/toolkit';
import slice from './slice.js';

export default configureStore({
  reducer: {
    slice,
  },
});
