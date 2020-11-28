// (roughly) swiping tenhou's scheme for tile indexes
// index 1-9 is manzu
// index 11-19 is pinzu
// index 21-29 is souzu
// index 31-34 are winds (east, south, west, north)
// index 35-37 are dragons (white, green, red)
// the other three copies of each tile follow the same scheme, offset by 40 for each copy

const SUITS = ['m', 'p', 's'];
const HONORS = ['east', 'south', 'west', 'north', 'white', 'green', 'red'];

export function Counter(defaultValue = 0) {
  return new Proxy(
    {},
    {
      get: (obj, prop) => (obj.hasOwnProperty(prop) ? obj[prop] : defaultValue),
    }
  );
}

export function isValidTile(id) {
  return (
    id < 158 && id % 10 && (Math.floor((id % 40) / 10) !== 3 || id % 10 < 8)
  );
}

export function isValidIndex(index) {
  return (
    index < 38 && index % 10 && (Math.floor(index / 10) !== 3 || index % 10 < 8)
  );
}

export function byIndex(tiles) {
  const byIndex = [];
  tiles.forEach((tile) => {
    if (byIndex[tile % 40]) byIndex[tile % 40].push(tile);
    else byIndex[tile % 40] = [tile];
  });
  return byIndex;
}

export function sortedCopy(tiles) {
  return tiles.slice().sort((a, b) => (a % 40) - (b % 40));
}

export const tile = {
  suit(tile) {
    return tile % 40 < 30 ? SUITS[Math.floor((tile % 40) / 10)] : undefined;
  },
  value(tile) {
    return tile % 40 < 30 ? tile % 10 : undefined;
  },
  toString(tile) {
    if (tile < 30) return `${this.value}${this.suit}`;
    else return HONORS[tile - 1];
  },
};

export function createTileList(shuffeIterations = 4) {
  const tiles = [...Array(158).keys()].filter((i) => isValidTile(i));
  for (let i = 0; i < shuffeIterations; i++)
    tiles.sort(() => 0.5 - Math.random());
  return tiles;
}

export const matchers = {
  // matchers modify count but not hand
  triplet(hand, count, index) {
    if (count[index] >= 3) {
      const match = hand.filter((tile) => tile % 40 === index);
      if (count[index] === 4) match.pop();
      count[index] -= 3;
      if (match.includes(undefined)) debugger;
      return match;
    }
  },
  sequence(hand, count, index) {
    if (
      index + 2 < 30 &&
      count[index] &&
      count[index + 1] &&
      count[index + 2]
    ) {
      const match = [];
      for (let range = 0; range < 3; range++) {
        match.push(hand.find((tile) => tile % 40 === index + range));
        if (match.includes(undefined)) debugger;
        count[index + range]--;
      }
      return match;
    }
  },
  pair(hand, count, index) {
    if (count[index] >= 2) {
      const match = hand.filter((tile) => tile % 40 === index);
      while (match.length > 2) match.pop();
      if (match.includes(undefined)) debugger;
      count[index] -= 2;
      return match;
    }
  },
  insideWait(hand, count, index) {
    if (index + 1 < 30 && count[index] && count[index + 1]) {
      const match = [];
      match.push(hand.find((tile) => tile % 40 === index));
      match.push(hand.find((tile) => tile % 40 === index + 1));
      if (match.includes(undefined)) debugger;
      count[index]--;
      count[index + 1]--;
      return match;
    }
  },
  outsideWait(hand, count, index) {
    if (
      index + 2 < 30 &&
      count[index] &&
      count[index + 2] &&
      Math.floor(index / 10) === Math.floor((index + 2) / 10)
    ) {
      const match = [];
      match.push(hand.find((tile) => tile % 40 === index));
      match.push(hand.find((tile) => tile % 40 === index + 2));
      if (match.includes(undefined)) debugger;
      count[index]--;
      count[index + 2]--;
      return match;
    }
  },
};

export function handChunker(hand) {
  const chunks = [];
  const count = Counter();
  hand.forEach((tile) => count[tile % 40]++);

  function findChunk(hand, count, accumulator = [], index = 1) {
    for (index; index < 38; index++) {
      if (!hand.length) break;
      if (!index % 10) continue; // invalid indexes
      for (const matcher of Object.values(matchers)) {
        // runs on side effects: expects matcher to decrement count
        const countCopy = {...count};
        const match = matcher(hand, countCopy, index);
        if (match) {
          const handCopy = hand.filter((tile) => !match.includes(tile));
          const accCopy = [match, ...accumulator];
          findChunk(handCopy, countCopy, accCopy, index);
        }
      }
    }
    chunks.push({unmatched: hand, matches: accumulator});
  }

  findChunk(hand, count);
  return chunks;
}
