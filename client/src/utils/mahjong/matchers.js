import {hand} from './helper';

const matchers = {
  triplet(tiles, index) {
    if (hand.count(tiles, index) >= 3) return [index, index, index];
    else return null;
  },
  sequence(tiles, index) {
    if (
      index + 2 < 30 &&
      hand.count(tiles, index) &&
      hand.count(tiles, index + 1) &&
      hand.count(tiles, index + 2)
    )
      return [index, index + 1, index + 2];
    else return null;
  },
  pair(tiles, index) {
    if (hand.count(tiles, index) === 2) return [index, index];
    else return null;
  },
  insideWait(tiles, index) {
    if (
      index + 1 < 30 &&
      hand.count(tiles, index) &&
      hand.count(tiles, index + 1)
    )
      return [index, index + 1];
    else return null;
  },
  outsideWait(tiles, index) {
    if (
      index + 2 < 30 &&
      hand.count(tiles, index) &&
      hand.count(tiles, index + 2)
    )
      return [index, index + 2];
    else return null;
  },
};

export default matchers;
