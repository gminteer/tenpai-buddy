import {Counter, handChunker} from './helper';

function singleTileUkeire(tile) {
  const index = tile % 40;
  if (index < 30) {
    switch (index % 10) {
      case 1:
        return [index, index + 1];
      case 9:
        return [index - 1, index];
      default:
        return [index - 1, index, index + 1];
    }
  } else {
    return [index];
  }
}

function matchUkeire(match) {
  // assumes match is already sorted by index
  if (match.length === 2) {
    const [a, b] = match.map((tile) => tile % 40);
    const matchDelta = Math.abs(a - b);
    switch (matchDelta) {
      case 0:
        return [a];
      case 1:
        if (a % 10 === 1) return [b + 1];
        else if (b % 10 === 9) return [a - 1];
        else return [a - 1, b + 1];
      case 2:
        return [a + 1];
      default:
        throw new Error("This shouldn't happen.");
    }
  }
  if (match.length !== 3) throw new Error("This shouldn't happen.");
  return [];
}

function calcShanten(matches) {
  const BASE_SHANTEN = 8;
  matches.sort((a, b) => b.length - a.length);
  const shantenMatches = matches.slice(0, 5);
  let shanten = shantenMatches.reduce(
    (acc, cur) => acc - (cur.length - 1),
    BASE_SHANTEN
  );
  const hasPair = matches.find(
    (match) => match.length === 2 && match[0] % 40 === match[1] % 40
  );
  if (
    !hasPair &&
    matches.reduce((acc, cur) => (cur.length === 2 ? acc + 1 : acc), 0)
  )
    shanten++;
  return shanten;
}

function calc7PairsShanten(matches) {
  return (
    7 -
    matches.filter(
      (match) => match.length === 2 && match[0] % 40 === match[1] % 40
    ).length
  );
}

const ORPHAN_INDEXES = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37];
function calc13OrphansShanten(hand) {
  // need to account for having one copy
  return (
    13 -
    new Set(
      hand
        .map((tile) => tile % 40)
        .filter((tileIndex) => ORPHAN_INDEXES.includes(tileIndex))
    ).size
  );
}

function scoreChunkSet(chunkSet, liveTiles, findDiscard = false) {
  const {matches, unmatched} = chunkSet;
  const shanten = calcShanten(matches);
  if (shanten < 0) return {chunkSet, shanten, isComplete: true};
  const ukeireTiles = [];
  let discard = undefined;
  let singles = unmatched
    .map((tile) => [tile, singleTileUkeire(tile)])
    .sort(
      ([, a], [, b]) =>
        b.reduce((acc, cur) => acc + liveTiles[cur], 0) -
        a.reduce((acc, cur) => acc + liveTiles[cur], 0)
    );

  const pairs = matches.filter(
    (match) => match.length === 2 && match[0] % 40 === match[1] % 40
  );
  console.log(pairs.length);
  if (findDiscard) {
    const matchedUkeireTiles = matches
      .filter((match) => pairs.length !== 1 || match !== pairs[0])
      .map((match) => [
        match,
        matchUkeire(match).reduce((acc, cur) => acc + liveTiles[cur], 0),
      ])
      .sort(([, a], [, b]) => b - a);
    if (!singles.length) {
      singles = matchedUkeireTiles
        .pop()[0]
        .map((tile) => [tile, singleTileUkeire(tile)])
        .sort(
          ([, a], [, b]) =>
            b.reduce((acc, cur) => acc + liveTiles[cur], 0) -
            a.reduce((acc, cur) => acc + liveTiles[cur], 0)
        );
    }

    matchedUkeireTiles
      .filter((match) => pairs.length !== 1 || match !== pairs[0])
      .forEach(([match]) => ukeireTiles.push(...matchUkeire(match)));
    discard = singles.pop()[0];
  } else {
    matches.forEach((match) => ukeireTiles.push(...matchUkeire(match)));
  }

  if (!(matches.length === 4 && !matches.find((match) => match.length !== 3))) {
    for (let i = 0; i < 5 - matches.length; i++)
      ukeireTiles.push(...singles[i][1]);
  } else {
    if (singles.length !== 1) debugger;
    ukeireTiles.push(liveTiles[singles[0][0]]);
  }

  const uniqueTiles = [...new Set(ukeireTiles)];
  const ukeireCount = uniqueTiles.reduce((acc, cur) => acc + liveTiles[cur], 0);
  return {chunkSet, shanten, ukeireCount, ukeireTiles: uniqueTiles, discard};
}

function findBest(hand, liveTiles, findDrop = false) {
  const chunks = handChunker(hand);
  const target = Math.min(
    5,
    chunks.reduce((a, b) => (a.matches.length > b.matches.length ? a : b))
      .matches.length
  );
  const worthScoring = chunks.filter(
    (chunkSet) => chunkSet.matches.length >= target
  );
  const scoredChunks = worthScoring.map((chunkSet) =>
    scoreChunkSet(chunkSet, liveTiles, findDrop)
  );
  const {shanten: bestShanten} = scoredChunks.reduce((a, b) => ({
    shanten: Math.min(a.shanten, b.shanten),
  }));
  const filteredByShanten = scoredChunks.filter(
    (chunk) => chunk.shanten === bestShanten
  );
  const {ukeireCount: bestUkeire} = filteredByShanten.reduce((a, b) => ({
    ukeireCount: Math.max(a.ukeireCount, b.ukeireCount),
  }));
  const best = filteredByShanten.find(
    (chunkSet) => chunkSet.ukeireCount === bestUkeire || chunkSet.isComplete
  );
  return best;
}

export default function scoreMove(hand, discard, seenTiles) {
  const liveTiles = new Counter(4);
  seenTiles.forEach((tile, idx) => (liveTiles[idx] -= tile.length));

  const ideal = findBest(hand, liveTiles, true);
  const player = findBest(
    hand.filter((tile) => tile !== discard),
    liveTiles
  );
  player.discard = discard;

  if (player.shanten === 0) return {gameOver: true, player};
  else if (player.shanten > ideal.shanten)
    return {badMove: 'SHANTEN', player, ideal};
  else if (player.ukeireCount < ideal.ukeireCount)
    return {badMove: 'UKEIRE', player, ideal};
  else return {badMove: false, player, ideal};
}
