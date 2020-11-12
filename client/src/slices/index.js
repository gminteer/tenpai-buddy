import {configureStore} from '@reduxjs/toolkit';

import game from './game';
import scores from './scores';
import me from './me';

export default configureStore({
  reducer: {
    game,
    scores,
    me,
  },
});
