import {configureStore} from '@reduxjs/toolkit';
import game from './game';

export default configureStore({
  reducer: {
    game,
  },
});
