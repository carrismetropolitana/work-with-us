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

## Compose the Docker and GO!
I've pulled the repo to my Linux and ran the docker compose to create the MongoDB

---

## Creating the DB

favorite table shall has: 
cada um deve ter como propriedades o valor da data de criação em UnixTimestamp e OperationalDate
and at the Dates object from the tmlmobilidade's utils has these two attributes (node_modules/@tmlmobilidade/utils/dist/src/dates/dates.js)

Now I'll create the db schema
api/
    src/models
    src/routes
    src/index.ts

favorite model
    - lineId
    - createdAt
    - operationalDate
  and both dates need t be setted by me and not the app, to be more secure and cosistently

created apps/api/src/models/favorite.model.ts to ensure the schema for MongoDB and the date setter
set at the compose.yml a volume for the Mongo's data persinstency :)

## Creating the API

### Favorites
GET All
GET One
POST One
DELETE One

use Fastify as this project already uses

need to create the routes dir
endpoins createds and with data ensurements pretty simple as I've been doing with Flask all my life

### Routes - Implementation Details

created apps/api/src/routes/favorites.route.ts

first tried to set createdAt and operationalDate via a pre('save') hook on the model
but mongoose validates required fields BEFORE running hooks, so it was failing with
"Path `createdAt` is required" even though the hook would set it
moved the Dates.now('Europe/Lisbon') logic directly into the POST handler instead
lesson learned: hooks run after validation, not before

the visibleFavorite mapping pattern came naturally - didn't want to expose the mongo _id
and other internal fields to the client, so I map only what matters:
- lineId
- createdAt (unix timestamp, useful for future filters)
- createdAtHumanReadable (ISO string for debugging/display)
- operationalDate (the TML operational date concept - midnight services belong to previous day)

always return `reply.send()` - fastify doesn't stop execution on reply, unlike flask's return
learned this the hard way when delete was sending two responses haha

unix_timestamp from Dates is already in milliseconds, no need to * 1000
(wasted a few minutes on that one)

------

# Frontend

now the app api is ready to go! maybe if any data turn to be needed okay, I will return to API but now we follow here

## First Steps
First, I looked up for all commmon ui items at `node_modules/@tmlmobilidade/ui/dist/src/components/common`

## "Line Objects"
Now I have to build "lines objects" to be used by the frontend. They will be from the Carris API (base URL saved at the .env.local). They are determinated at lib in frontend's src as carris.ts

{
    "color": "#C61D23",
    ~"district_ids": [],~
    ~"facilities": [],~
    "id": "1001",
    ~locality_ids": [],~
    "long_name": "Alfragide (Estr Seminario) - Reboleira (Estação)",
    ~"municipality_ids": [],~
    "pattern_ids": [ --> I WANT BUT THE PATTERN OBJECT ISA TOO LARGE AS THE DOC SAYS
      "1001_0_2",
      "1001_0_1"
    ],
    ~region_ids": [],~
    "route_ids": [ --> Need to be aware that some routes may have the same line's name
      "1001_0"
    ],
      if route_ids.lenght > 0 {for (let i = 0; i < route_ids.lenght; i++) {route_names.push(GET all filter(id == id).tts_name)}}
    "short_name": "1001",
    "stop_ids": [], --> I want, its a nested request
      if stop_ids.lenght > 0 {for (let i = 0; i < stop_ids.lenght; i++) {stop_names.push(GET all filter(id == id).long_name)}}
    "text_color": "#FFFFFF",
    "tts_name": "Linha 1001 com percurso Alfragide ( Estrada Seminario ) - Reboleira ( - Estaçaão )"
}

Actual line Object:
```
const CARRIS_API = process.env.CARRIS_PUBLIC_API_URL || 'https://api.carrismetropolitana.pt'

export interface CarrisLine {
    id: string
    short_name: string
    long_name: string
    color: string
    text_color: string
    route_ids: string[]
    stop_ids: string[]
    tts_name: string
}

// The API returns the routes and stops as a full array,
// so map/filter will run for each line to get its routes and stops.
// This is not ideal, but it is the only way
export interface CarrisRoute {
    id: string
    line_id: string
    long_name: string
    tts_name: string
    color: string
    text_color: string
}

export interface CarrisStop {
    id: string
    long_name: string
    lat: number
    lon: number
    lines: string[]
}

export interface EnrichedLine extends CarrisLine {
    routes: CarrisRoute[]
    stops: CarrisStop[]
}

export async function getEnrichedLines(): Promise<EnrichedLine[]> {
    // Storing as promises to run in parallel (faster)
    const [linesProm, routesProm, stopsProm] = await Promise.all([
        fetch(`${CARRIS_API}/v2/lines`),
        fetch(`${CARRIS_API}/routes`),
        fetch(`${CARRIS_API}/stops`)
    ])
    
    if (!linesProm.ok || !routesProm.ok || !stopsProm.ok) {
        throw new Error('Failed to fetch lines, routes, or stops')
    }

    // Awaiting the JSON parsing after checking the responses to avoid unnecessary parsing if any of the fetches failed
    const [lines, routes, stops]: [CarrisLine[], CarrisRoute[], CarrisStop[]] = await Promise.all([
        linesProm.json(),
        routesProm.json(),
        stopsProm.json()
    ])

    return lines.map(line => ({
        ...line,
        routes: routes.filter(route => route.line_id === line.id), // Matching routes by line_id -> []
        stops: stops.filter(stop => stop.lines.includes(line.id)) // Matching stops by checking if the stop id is in the line's stop_ids array -> []
    }))
}
```

## Line Card
Beta/draft version:

![alt text](linebeta.png)

this is a component so I am starting a new dir at the src

to make the side yellow part following to Carris site it has to be a <a> with target blank, vertical alingment e every thing at center and a arrow to right

### As the card componet is done
I have to get an array of lines and call the constructor for aech line in array and display they at page.tsx

- Import the get for enrichedLines and construct linecards for each row

#### Rebuild do LineCard
to use more of the tmlmobilidade ui I will use Badge from common
the lien Id will be inside a Badge

## Favorites
To switch between buttons I have to filter using state and the react state