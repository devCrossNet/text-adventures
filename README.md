# Text Adventures [WIP]

> A collection of open-source text based adventures

This is a demo how to use the [quaire-library](https://github.com/devCrossNet/quaire) to create text based adventures.

**_Fell free to create pull-requests with your very own Game story!_**

## Requirements

- Node.js >= 22.12
- npm 11

## Project setup

```shell
npm install
```

### Start the development server

```shell
npm run dev
```

### Build for production

```shell
npm run build
npm run preview
```

### Run the tests

```shell
npm test
```

### Type check, lint, and format

```shell
npm run typecheck
npm run lint
npm run prettier
```

`npm run test:release` runs all checks. The pre-commit hook runs it, too.
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## Create your own game

A game is a list of [quaire](https://github.com/devCrossNet/quaire) question definitions in `src/games/<game-id>/index.ts`.
Besides the built-in types (e.g. `SINGLE_SELECT` and `INPUT`), games can use the `DIALOG` type from `src/quaire.ts`.
A dialog prints its `lines`, and `<%= key %>` inserts a former answer.
Add a test with `validateDefinition()` to find mistakes in your data, see `tests/unit/games`.
