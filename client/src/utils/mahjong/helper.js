// (roughly) swiping tenhou's scheme for tile indexes
// index 1-9 is manzu
// index 11-19 is pinzu
// index 21-29 is souzu
// index 31-34 are winds (east, south, west, north)
// index 35-37 are dragons (white, green, red)
// the other three copies of each tile follow the same scheme, offset by 40 for each copy

const SUITS = ['m', 'p', 's'];

// validators
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

// tile arrays
export function sortedCopy(tiles) {
  return tiles.slice().sort((a, b) => (a % 40) - (b % 40));
}
export function byIndex(tiles) {
  const byIndex = [];
  tiles.forEach((tile) => {
    if (byIndex[tile % 40]) byIndex[tile % 40].push(tile);
    else byIndex[tile % 40] = [tile];
  });
  return byIndex;
}

export const tile = {
  suit(tile) {
    return tile % 40 < 30 ? SUITS[Math.floor((tile % 40) / 10)] : undefined;
  },
  value(tile) {
    return tile % 40 < 30 ? tile % 10 : undefined;
  },
};

export const hand = {
  popAt(tiles, index) {
    const arrIdx = tiles.findIndex((tile) => tile % 40 === index);
    return tiles.splice(arrIdx, 1)[0];
  },
  count(tiles, index) {
    return tiles.filter((tile) => tile % 40 === index).length;
  },
  filterBy(tiles, index) {
    return tiles.filter((tile) => tile % 40 === index);
  },
};

// TODO: better tile randomization
export function createTileList(shuffeIterations = 4) {
  const tiles = [...Array(158).keys()].filter((i) => isValidTile(i));
  for (let i = 0; i < shuffeIterations; i++)
    tiles.sort(() => 0.5 - Math.random());
  return tiles;
}

export function Counter(defaultValue = 0) {
  return new Proxy(
    {},
    {
      get: (obj, prop) => (obj.hasOwnProperty(prop) ? obj[prop] : defaultValue),
    }
  );
}
