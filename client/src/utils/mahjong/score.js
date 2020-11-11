import {tile, hand} from './helper.js';

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

const BASE_SHANTEN = 8; // hand is 8 draws away from tenpai at worst
function calcShanten(matches) {
  return matches.reduce((acc, cur) => acc - (cur.length - 1), BASE_SHANTEN);
}

function calcUkeire(matches) {
  // TODO: track live tiles
  const matchUkeire = matches.reduce((acc, cur) => {
    if (cur.length === 2) {
      const tileDelta = Math.abs((cur[0] % 40) - (cur[1] % 40));
      switch (tileDelta) {
        case 0: // pair
          return acc + 2;
        case 1: // two adjacent
          if (
            [1, 9].includes(tile.value(cur[0])) ||
            [1, 9].includes(tile.value(cur[1]))
          )
            // it's on an edge
            return acc + 4;
          else return acc + 8;
        case 2: // outside draw
          return acc + 4;
        default:
          throw new Error("this shouldn't happen");
      }
    }
    if (cur.length !== 3) throw new Error("this shouldn't happen");
    return acc;
  }, 0);
  const singles = 5 - matches.length;
  if (singles) return matchUkeire + singles * 8;
  else return matchUkeire;
}

// REFACTOR: this is not efficient at all
// (if I wrote it right) it just walks down
// every possible permutation of interpreting the given hand
// and returns the best score found
export function findBestScore(tiles) {
  let bestHand = [];
  let bestShanten = BASE_SHANTEN;
  let bestUkeire = 0;
  let unmatched = [];

  function interpretHand(tiles, acc = []) {
    // loop through possible tile indexes
    for (let i = 1; i < 38; i++) {
      // copy incoming hand
      const tilesCopy = [...tiles];
      // try each matcher
      for (const matcher of Object.values(matchers)) {
        const matchRange = matcher(tilesCopy, i);
        const matchTiles = [];
        if (matchRange) {
          // pull matched tiles out of hand copy
          matchRange.forEach((tileIndex) => {
            matchTiles.push(hand.popAt(tilesCopy, tileIndex));
          });

          if (
            matchTiles.includes(undefined) ||
            matchRange.length !== matchTiles.length
          )
            // sanity check
            throw new Error('matcher is fubar');

          // add match to accumulator
          const matches = [...acc, matchTiles];
          const matchShanten = calcShanten(matches);
          const matchUkeire = calcUkeire(matches);
          if (
            matchShanten < bestShanten ||
            (matchShanten === bestShanten && matchUkeire > bestUkeire)
          ) {
            bestHand = matches;
            bestShanten = matchShanten;
            bestUkeire = matchUkeire;
            unmatched = [...tilesCopy];
          }
          // branch for match
          interpretHand(tilesCopy, matches);
        }
      }
    }
  }

  interpretHand(tiles);
  return {hand: bestHand, shanten: bestShanten, ukeire: bestUkeire, unmatched};
}

// this can also probably be optimized
export function findDrops(tiles) {
  let best = null;
  for (let i = 0; i < 14; i++) {
    const tilesCopy = [...tiles];
    tilesCopy.splice(i, 1);
    const result = findBestScore(tilesCopy);
    if (
      !best ||
      result.shanten < best.shanten ||
      (result.shanten === best.shanten && result.ukeire > best.ukeire)
    )
      best = result;
  }
  return best;
}

export function scoreMove(tiles, discard) {
  const drops = findDrops(tiles);
  if (drops.unmatched.includes(discard)) {
    console.log('Check ukeire here');
  } else {
    console.log(
      `Bad move? Discarded: "${discard}", unmatched: `,
      drops.unmatched
    );
  }
  return drops;
}
