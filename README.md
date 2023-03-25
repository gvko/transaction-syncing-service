## Task Design, Considerations & Assumptions
See [NOTES.md](./NOTES.md)


## Prerequisites to run the app

1. Create a file named `.env` in the root of the project dir
2. Copy-paste the contents of the `.env.example` file into the `.env` file
3. Replace the `<KEY>` value with the Alchemy secret URL key for your node instance.
4. If you want to use a testnet instead of a mainnet (eg. Goerli, Sepolia, Mumbai), make sure to actually change the whole URL for WS and HTTP URLs. There is no need to create new env vars for the testnets - you just have to update the URL values.

### Quick start

Run
```bash
docker-compose up
```

And that's it.

This command will prepare docker containers and run everything needed:

* build the API server image
* start its container
* start the DB container
* run the DB migrations to create the needed tables

The transactions sync will start the moment the server is up and running.

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
$ npm start
```
This will start the app locally in watch mode.

