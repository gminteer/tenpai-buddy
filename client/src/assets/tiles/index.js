import {isValidIndex} from 'utils/mahjong/helper';

export const blank = require('./blank.svg').default;
export const front = require('./front.svg').default;
export const back = require('./back.svg').default;

export const faces = Array(38)
  .fill(null)
  .map((val, idx) =>
    isValidIndex(idx) ? require(`./${idx}.svg`).default : blank
  );
