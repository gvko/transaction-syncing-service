## Task Considerations & Assumptions

## Prerequisites to run the app

1. Create a file named `.env` in the root of the project dir
2. Copy-paste the contents of the `.env.example` file into the `.env` file
3. Replace the `<KEY>` value with the Alchemy secret URL key for your node instance.

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

