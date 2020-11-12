import React from 'react';

export default function Home() {
  return (
    <main>
      <div>
        <h2>About</h2>
        <p>
          Tenpai Buddy is a game / practice drill for improving your Riichi
          Mahjong skills by focusing on <em>tile efficiency</em>. Improving your
          tile efficiency will allow your hand to become <em>tenpai</em>{' '}
          ("ready" i.e. one tile away from having a complete hand) with fewer
          draws, thus improving your chances of winning a round.
        </p>
        <p>
          To improve your tile efficiency, you'll want to focus on two key
          metrics: <em>shanten</em>, or how many tiles away from tenpai your
          current hand is at minimum, and <em>ukeire</em>, or how many tiles
          could that could improve your hand.
        </p>
        <p>
          It's worth noting that tile efficiency is only one of many factors you
          should be considering when determining which tile to discard.
          Defensive play is certainly just as important, if not more so
          (defensive play drills coming in an update eventually!). Ignoring
          that, focusing purely on tile efficiency when playing offensively is
          likely to produce low scoring hands. Remember to play responsibly!
        </p>
        <p>
          Mahjong tiles courtesy of{' '}
          <a href="https://github.com/FluffyStuff/riichi-mahjong-tiles">
            FluffyStuff
          </a>{' '}
          via{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC BY-4.0</a>
        </p>
      </div>
      <footer>
        <span>© 2020 gminteer@gmail.com</span>
        <span>
          <a href="https://github.com/gminteer/tenpai-buddy">
            Check out the source code here
          </a>
        </span>
        <span>Powered by &lt;3 emojis</span>
      </footer>
    </main>
  );
}
