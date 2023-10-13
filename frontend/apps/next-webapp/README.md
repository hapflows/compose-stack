This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

_Note on version: the latest Next.js version has an issue with
[hot reload not working](https://github.com/vercel/next.js/issues/51162),
so a previous stable version has been used_

## Development

To start the web application development, run the server with:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This projects uses the [new routes](https://nextjs.org/docs/app/building-your-application/routing)
based on the `app` folder structure.

## Production

The ideal deployment for a production instance of a Next.js application is the
[Vercel platform](https://vercel.com/). It offers a very generous free tier that can
be enough for most of the small applications, and it scales autonomously.

#### Instructions on how to deploy a monorepo will be added here

## Project structure

The application follows the "new" [App Router](https://nextjs.org/docs/getting-started/project-structure) concept: the files inside the special `app` folder work together with
Next.js router to render pages based on filesystem.
These are the basic concepts:

- folder paths represents navigation paths: i.e. `app/login` folder represents `/login`
  URL;
- a special file called `page.tsx` exports a default component that renders the page of
  that folder/route, i.e. `app/login/page.tsx` default component renders when the
  URL is `/login`;
- a special file called `layout.tsx` renders a common structure for all the routes
  adjacent to it. For example, the file `app/layout.tsx` wraps ALL routes, while the
  file `app/dashboard/layout.tsx` wraps only the routes starting with `/dashboard`;
- special folders with name between parentheses allows to group routes and have a dedicated
  layout, i.e. `app/(authentication)/login` and `app/(authentication)/register` are both
  wrapped by the same `app/(authentication)/layout.tsx` component, while their URL is still
  `/login` and `/register` (the group is ignored). These groups are called
  [Route Groups](https://nextjs.org/docs/app/building-your-application/routing);
- components are _server components_ by default: they are rendered on the server and
  returned to the client, then are _hydrated_ to make them interactive (if needed).
  This means that some usual React functionalities are not available in every component,
  and they need to be marked with directive `use client`. This is required when using
  React's hooks like `useState` or `useRef`.

To keep the `app` folder as small as possible, other folders have been added:

- `core`: includes files used by all application, without other dependencies; an example is
  a convenience wrapper around `fetch` or utilities to write to `localStorage`;
- `styles`: global styles, importing the `packages/ui` as well;
- `apps`: a container for all hooks and components divided by logical scope, used by pages.

### Apps list

The `apps` folder contains the following applications.

#### auth

Authentication related store, components, service and hooks. This sub-application
initializes the authentication store, offers a service to login and register new users
as well as reset their password.

It also includes components to login and register, which needs to be included in their
respective pages.

The `useAuthenticationSetup` hook documents how authentication works after a user logged in:

- it checks if a JWT token is present in `localStorage`;
- if it's not expired, it generates auth headers for subsequent requests and sets a
  timeout to refresh the tokens, then sets the user object;
- if the token is expired, it deletes it and sets the user to null.

The file `apps/auth/services/auth.ts` includes the main logic around the auth app.

#### dashboard

Components and hooks used in the `/dashboard` route.
