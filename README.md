# winna-provably-fair

Verify Winna Originals game results from a seed.

## Usage

```ts
import { getDiceResult } from './src';

getDiceResult({ serverSeed: '...', clientSeed: '...', nonce: 1 });
```

## Games

- [Baccarat](src/baccarat.ts)
- [Blackjack](src/blackjack.ts)
- [Coin Climber](src/coin-climber.ts)
- [Coinflip](src/coinflip.ts)
- [Dice](src/dice.ts)
- [Goal](src/goal.ts)
- [Hilo](src/hilo.ts)
- [Keno](src/keno.ts)
- [Limbo](src/limbo.ts)
- [Mines](src/mines.ts)
- [Pepe Tower](src/pepe-tower.ts)
- [Plinko](src/plinko.ts)
- [Roulette](src/roulette.ts)
- [Slide](src/slide.ts)
- [Twenty One](src/twenty-one.ts)
- [Wheel](src/wheel.ts)

All games share the seed-to-random-number logic in [`src/provably-fair.ts`](src/provably-fair.ts).

## Integrity

`src/provably-fair.ts` SHA1:

```
0ee4fec7ef20b9b7dd41b23d5d7f7cd866a83aee
```

Check with `shasum -a 1 src/provably-fair.ts`.

## Development

```sh
yarn install
yarn lint
yarn typecheck
```

## License

MIT
