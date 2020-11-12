import {configureStore} from '@reduxjs/toolkit';

import game from './game';
import scores from './scores';

export default configureStore({
  reducer: {
    game,
    scores,
  },
});
