# compose-stack UI Components

This package creates a base set of components that can
be used in other packages and applications. It has no
other "internal" dependencies (i.e. other packages) and only
relies on third-party ones.

This package contains few examples on how to create a library,
bundle it, add tests and coverage, and how to document the components
(where "stories" are used by another app).

It also shows:

- how to use TypeScript to create components and how to use
  [Rollup](https://rollupjs.org/) to bundle them;
- how to optimize the build by not including third party libraries
  in the bundle;
- how to use [Jest](https://jestjs.io/) and
  [React testing library](https://github.com/testing-library/jest-dom)
  to write unit tests;
- how to use a Context to include common configurations for components
  without the need to always pass props down;
- styles with `scss` and variables composition.

## Monorepo

The frontend package works as a monorepo with help of
[yarn workspaces](https://yarnpkg.com/features/workspaces).
This structure allows to have shared packages/libraries between
different projects and to have these projects together in the same
repository, even if they are using different technologies.

For example, in this way we can have a Next.js application alongside
a Storybook documentation site, both sharing the UI library.
We can also scale more by introducing a landing site, an administration
dedicated application, etc., possibly sharing packages.

Each app/package contains a `README` file that explains how the
app/package works, which are the dependencies and which is the development
flow.

## Installation

From this main folder, run:

```bash
yarn
```

## Development

To develop the UI components package, run:

```bash
yarn ui:dev
```

This will run Rollup in watch mode, so the changes will be picked up and compiled
to verify they are correct from a TS point of view.

Then, create a new folder under `components`, i.e. `link`, and the following files:

- `Link.tsx`: this will include the code of the component;
- `Link.types.ts`: the types definitions will go here;
- `link.test.tsx`: file that will include testing-library unit tests,
  to cover the component code;
- `link.scss`: styles file.

Then, export the component in the `index.ts` file and import the style file
in `styles/ui.full.scss` file to make the new component fully available.

After writing the tests, run the suite with:

```bash
yarn ui:test
```

And check coverage with:

```bash
yarn ui:coveralls
```

## Build

To build the UI components package, run:

```bash
yarn ui:build
```
