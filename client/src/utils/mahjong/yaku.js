const yaku = {
  riichi() {
    // 1 closed
    // bet 1000 on closed tenpai hand, can no longer change hand
  },
  tsumo() {
    // 1 closed
    // completing hand with wall draw
  },
  identicalSequence() {
    // 1 closed
    // two identical sequences (same suit and same values)
  },
  doubleIdenticalSequence() {
    // 3 closed
    // 2x identical sequence
  },
  noPoints() {
    // 1 closed
    // hand worth no fu (all sequences, pair isn't yakuhai tiles, open wait)
  },
  allSimples() {
    // 1 open
    // no terminals or honors
  },
  yakuhai() {
    // 1 open
    // triplet of yakuhai tiles (dragons, seat wind, round wind)
  },
  robbedKan() {
    // 1 open
    // calling ron on a added kan
  },
  deadWallDraw() {
    // 1 open
    // completing hand on dead wall draw after calling kan
  },
  lastDraw() {
    // 1 open
    // tsumo on last tile draw in round
  },
  lastDiscard() {
    // 1 open
    // calling ron on last tile discard
  },
  mixedOutside() {
    // 1 open, 2 closed
    // every group contains a terminal or honor
  },
  fullOutside() {
    // 2 open, 3 closed
    // every group contains a terminal
  },
  threeColorStraight() {
    // 1 open, 2 closed
    // three sequences with the same values, one in each suit
  },
  fullStraight() {
    // 1 open, 2 closed
    // 1-2-3, 4-5-6, 7-8-9 in one suit
  },
  sevenPairs() {
    // 2 closed
    // special hand shape (7 pairs)
  },
  threeColorTriplets() {
    // 2 open
    // three triplets with the same values, one in each suit
  },
  terminalsOrHonors() {
    // 2 open
    // hand consists of nothing but terminal or honor tiles
  },
  allTerminals() {
    // yakuman open
    // hand consists of nothing but terminals
  },
  allHonors() {
    // yakuman open
    // hand consists of nothing but honors
  },
  threeLittleDragons() {
    // 2 open
    // two triplets of dragons with a pair of the third dragon type
  },
  threeBigDragons() {
    // yakuman open
    // three triplets of dragons
  },
  threeHiddenTriplets() {
    // 2 open
    // three closed triplets (4th group can be open)
  },
  fourHiddenTriplets() {
    // yakuman open
    // four closed triplets
  },
  threeKans() {
    // 2 open
  },
  fourKans() {
    // yakuman open
  },
  allTriplets() {
    // 2 open
  },
  mixedFlush() {
    // 2 open, 3 closed
    // hand consists of one suit and honors
  },
  fullFlush() {
    // 5 open, 6 closed
    // hand consists of nothing but one suit
  },
  noSimpleDiscards() {
    // mangan
    // at draw, player has discarded nothing but terminals and honors and no discards were claimed
  },
  blessing() {
    // yakuman closed
    // ...of heaven: completing hand on opening (east player has a complete hand at beginning)
    // ...of earth: completing hand on first wall draw
    // ...of man: calling ron on another player's first discard
  },
  yakumanByPoints() {
    // yakuman open
    // hand worth 13+ han
  },
  thirteenOrphans() {
    // yakuman closed, double yakuman if wait is on duplicate tile
    // special hand shape (one of each terminal and honor tile, one duplicate tile)
  },
  nineGates() {
    // yakuman closed, double yakuman if wait is on extra tile
    // 1-1-1-2-3-4-5-6-7-8-9-9-9 in one suit, extra tile is any tile in same suit
  },
  fourLittleWinds() {
    // yakuman open
    // three wind triplets and a pair of the last wind
  },
  fourBigWinds() {
    // double yakuman open
    // four wind triplets
  },
  allGreen() {
    // yakuman open
    // hand is entirely 2-3-4-6-8 sou tiles or green dragons
  },
};

function findYaku(chunkSet) {
  chunkSet.forEach((chunk) => {});
}
