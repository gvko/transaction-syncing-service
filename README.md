## Task Considerations & Assumptions
1. I was not sure what exactly you mean with ```write an endpoint to bring back the erc20 transfer event info as it gets indexed live```, so I built an endpoint that returns all events for a given block, that were parsed and stored in the DB.

2. I believe `logging in and creating accounts should be done using an ethereum wallet` requires a client side (aka front-end), be it web/desktop/mobile, in order to connect to the wallet and perform the signing actions. Since this task's context was only about backend I deemed it out of context ot build a client-side to interact with the wallet. Therefore, I was unsure how to fully achieve the second point of the first task.

## Prerequisites to run the app

1. Create a file named `.env` in the root of the project dir
2. Copy-paste the contents of the `.env.example` file into the `.env` file
3. Replace the `<KEY>` value with the Alchemy secret URL key for your node instance and the `<SECRET>` value with whatever string value you deem is good to be used for the JWT secret.

### Quick start

Run
```bash
docker-compose up
```

And that's it.

This command will prepare and run everything needed:

* build the API server image
* start its container
* start the DB container
* run the DB migrations to create the needed tables

The events sync will start the moment the server is up and running.

### Manual start

#### Install

```bash
$ npm install
```

#### Build

```bash
$ npm run build
```

#### DB Docker container

```bash
$ docker-compose up -d db
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

