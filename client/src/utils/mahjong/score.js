import {tile, hand, Counter} from './helper';
import matchers from './matchers';

const BASE_SHANTEN = 8; // hand is 8 draws away from tenpai at worst

function calcMatchUkeire(match, liveTiles) {
  // assumes match is sorted in tileIndexOrder
  if (match.length === 2) {
    const tileDelta = Math.abs((match[0] % 40) - (match[1] % 40));
    switch (tileDelta) {
      case 0: // pair
        return {match, ukeire: liveTiles[match[0] % 40], isPair: true};
      case 1: {
        // two adjacent
        if (tile.value(match[0]) === 1)
          return {match, ukeire: liveTiles[(match[0] % 40) + 2]};
        else if (tile.value(match[1]) === 9)
          return {match, ukeire: liveTiles[(match[0] % 40) - 1]};
        else
          return {
            match,
            ukeire:
              liveTiles[(match[0] % 40) - 1] + liveTiles[(match[1] % 40) + 1],
          };
      }
      case 2: {
        // inside draw
        return {match, ukeire: liveTiles[(match[0] % 40) + 1]};
      }
      default: {
        throw new Error("This shouldn't happen.");
      }
    }
  }
  if (match.length !== 3) throw new Error("This shouldn't happen.");
  return {match, ukeire: 0, isComplete: true};
}

function calcLoneUkeire(tileId, liveTiles, pairCount, matchCount) {
  const idx = tileId % 40;
  if (pairCount === 0 && matchCount === 4)
    return {tile: tileId, ukeire: liveTiles[idx]};
  if (idx < 30) {
    switch (tile.value(idx)) {
      case 1:
        return {tile: tileId, ukeire: liveTiles[idx] + liveTiles[idx + 1]};
      case 9:
        return {tile: tileId, ukeire: liveTiles[idx - 1] + liveTiles[idx]};
      default:
        return {
          tile: tileId,
          ukeire: liveTiles[idx - 1] + liveTiles[idx] + liveTiles[idx + 1],
        };
    }
  } else {
    return {tile: tileId, ukeire: liveTiles[idx]};
  }
}

function calcShanten(matches) {
  return matches.reduce(
    (acc, cur) => acc - (cur.match.length - 1),
    BASE_SHANTEN
  );
}

// REFACTOR: this is still probably not that efficient
// compute and score every possible hand interpretation
// then return the best score
export function findBestScore(tiles, liveTiles) {
  let bestHand = [];
  let bestShanten = BASE_SHANTEN;
  let bestUkeire = 0;
  let bestUnmatched = [];
  let bestWorstTile = null;
  let isTenpai = false;

  function interpretHand(tiles, liveTiles, acc = [], i = 1) {
    // loop through possible tile indexes
    for (i; i < 38; i++) {
      // skip invalid indexes
      if (!i % 10) continue;
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

          // quick sanity check
          if (
            matchTiles.includes(undefined) ||
            matchRange.length !== matchTiles.length
          )
            throw new Error('matcher is fubar');

          const scoredMatch = calcMatchUkeire(matchTiles, liveTiles);

          let matches = [];
          let unmatched = [...tilesCopy];
          const pairCount = acc.reduce(
            (total, cur) => (cur.isPair ? total + 1 : total),
            0
          );

          if (acc.length >= 5) {
            // drop worst match if we already have 5
            const worseMatchIdx = acc.findIndex(
              (matchObj) =>
                matchObj.match.length === 2 &&
                // pairs are worst only if we already have one
                matchObj.ukeire < scoredMatch.ukeire &&
                (!matchObj.isPair || pairCount > 1)
            );
            if (worseMatchIdx >= 0) {
              matches = [...acc];
              const dropped = matches.splice(worseMatchIdx, 1, scoredMatch)[0];
              unmatched.push(...dropped.match);
            } else {
              matches = acc;
            }
          } else {
            // otherwise just append it to the list of matches
            matches = [...acc, calcMatchUkeire(matchTiles, liveTiles)];
          }

          const shanten = calcShanten(matches);

          // if there are five matches and hand isn't tenpai drop worst match
          if (matches.length === 5) {
            if (shanten < 1) {
              isTenpai = true;
            } else {
              // drop match with worst ukeire that isn't complete, hanging on to at least one pair
              const potentialDrops = matches
                .filter((match) => !match.isComplete)
                .sort(({ukeire: a}, {ukeire: b}) => b - a);
              const dropped = potentialDrops
                .splice(
                  potentialDrops.indexOf((match) => match.isPair),
                  1
                )
                .pop();
              matches.splice(
                matches.indexOf((match) => match === dropped),
                1
              );
              unmatched.push(...dropped.match);
            }
          }
          const matchUkeire = matches.reduce(
            (acc, {ukeire}) => acc + ukeire,
            0
          );
          let worstTile = null;
          const unmatchedUkeire = unmatched
            .map((tileId) =>
              calcLoneUkeire(tileId, liveTiles, pairCount, matches.length)
            )
            .sort(({ukeire: a}, {ukeire: b}) => b - a);
          worstTile = unmatchedUkeire.pop();
          let ukeire = unmatchedUkeire.reduce(
            (acc, {ukeire}) => acc + ukeire,
            matchUkeire
          );

          const tileCount = matches.reduce(
            (total, cur) => total + cur.match.length,
            unmatched.length
          );
          // if evaluating a 13 tile hand count ukeire on the worst tile
          if (tileCount < 14) ukeire += worstTile?.ukeire || 0;

          // update best
          if (
            shanten < bestShanten ||
            (shanten === bestShanten && ukeire > bestUkeire)
          ) {
            bestHand = matches;
            bestShanten = shanten;
            bestUkeire = ukeire;
            bestUnmatched = unmatched;
            bestWorstTile = worstTile;
          }

          // branch on match (incrementing i to skip redundant branching)
          if (!isTenpai) interpretHand(tilesCopy, liveTiles, matches, i + 1);
        }
      }
    }
  }
  interpretHand(tiles, liveTiles);
  return {
    hand: bestHand,
    shanten: bestShanten,
    ukeire: bestUkeire,
    unmatched: bestUnmatched,
    worstTile: bestWorstTile,
    isTenpai,
  };
}

export function scoreMove(tiles, discard, seenTiles) {
  const liveTiles = new Counter(4);
  seenTiles.forEach((tile, idx) => (liveTiles[idx] -= tile.length));

  const idealResults = findBestScore(tiles, liveTiles);
  const playerResults = findBestScore(
    tiles.filter((tile) => tile !== discard),
    liveTiles
  );

  if (playerResults.isTenpai || playerResults.shanten === 0)
    return {gameOver: true, ukeire: playerResults.ukeire};
  else if (playerResults.shanten > idealResults.shanten)
    return {badMove: 'SHANTEN', player: playerResults, ideal: idealResults};
  else if (playerResults.ukeire < idealResults.ukeire)
    return {badMove: 'UKEIRE', player: playerResults, ideal: idealResults};
  else return {badMove: false, player: playerResults, ideal: idealResults};
}
