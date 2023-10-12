# compose-stack UI

This is the frontend of compose-stack project.

It includes few apps and packages, where the main ones are:

- `packages/ui`: a component library;
- `apps/next-webapp`: a web application written with Next.js framework;

## Monorepo

The frontend package works as a monorepo with help of
[yarn workspaces](https://yarnpkg.com/features/workspaces).
This structure allows to have shared packages/libraries between
different projects and to have these projects together in the same
repository, even if they are using different technologies.

For example, in this way we can have a NextJS application alongside
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

To develop the webapp, run:

```bash
yarn next-webapp:dev
```

## Build

To build the UI components package, run:

```bash
yarn ui:build
```

To build the webapp, run:

```bash
yarn next-webapp:build
```

Then run it with:

```bash
yarn next-webapp:run
```
