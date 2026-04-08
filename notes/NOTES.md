# How Do I Build a CM Web App from This?

First of all, I'll need to imagine a draft of an app

## Home Page
![home page 1](homepage1.png)
![home page 2](homepage2.png)
- No login to start
- Widgets like "modulares" informations, lika a block for each thing I wanna to show (lines, news, schedule, stops and so)
- Side bar
- Search for Line Widget

## MVP -> LINES PAGE
![get all lines](all_lines.png)
- A list fo all lines avaliable and a button for the favourites ones
- Each line will take the user to their page (maybe place a heart to favourite)

![Line's page](1line.png)
The line page

---

# What do I Need to Do?
Start the app and check how does it run (first a check of the port and DB, to use after the DB had been created too)

1 -> npm start, install and run dev
(I've written a throw error handling at api index.ts just to make sure everything is okay, even not been setted hahaha)

---

# Project Setup

## How It Runs
Turborepo runs two apps in parallel with `npm run dev`:
- `frontend` → Next.js, runs on localhost:3000
- `api` → Node.js/Express, runs on localhost:3001 (bootstrapped via src/index.ts)

The api needs the index.ts to start the server, connect to DB and register routes.

## MongoDB via Docker
MongoDB runs as a separate Docker container, independent from the Node processes.
yml at the root

## Environment Variables
### apps/api/.env
PORT=3001                                   
MONGODB_URI=mongodb://root:root@localhost:37001/cm-app?authSource=admin

### apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001