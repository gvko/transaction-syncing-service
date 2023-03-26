## Design
This backend app is designed with domain separation in mind.
I've chosen NestJS as framework since it is opinionated in a way that pushes the architecture to be separated by logical domains.

The app is quite simple, so I've separated it in just two domains: the Transaction module, which takes care of the transaction entity and all logic surrounding it (data layer, presentation layer and business logic). The second module is the Web3Provider, which takes care of all the interaction with the blockchain, thus abstracting any of that logic from the Transaction module (or any other possible modules).
This way the codebase stays clean and well separated.
For example, the Web3Provider module never talks to the database directly, since it doesn't contain any entities. Only entities talk to the DB, since they are the business logic representation of a DB column. Therefore, the Web3Provider module would only talk to other modules when data is being passed to/from the DB, and it is abstracted away from the DB, just like the Transaction module is abstracted away from the Blockchain node provider (Alchemy).
![tx-sync-service-domains.jpg](assets%2Ftx-sync-service-domains.jpg)


Upon start, the service pulls transaction data from the blockchain by iterating over given blocks, parsing and storing the tx data in the provided database. It will check what was the biggest block of any transaction stored in the DB, and start syncing transactions from there until the latest block in the chain. After the sync of past transactions is done, it will subscribe to listen for incoming new blocks and sync them automatically. This works for multiple chains asynchronously (currently only Ethereum and Polygon). Whether it's mainnet or testnet depends on the node URL provided as env vars.
This mechanism will allow for backfill of missed transactions in case of a system crash.
![txs-syncronizing-service.jpg](assets%2Ftxs-syncronizing-service.jpg)

We can have multiple services running, that will handle indexing, though we must take care of how they communicate and agree on which instance does the storage, to avoid data race conditions. Probably a better approach would be to just have only one instance running at a time that handles indexing. With a proper infrastructure setup, a crash would trigger the spin-off of a new instance, which would pick up the indexing from where the previous instance has left the state of the data.

The transaction analyzer can be plugged in through an API open for external access, or through the interface of an internal module. The approach depends on whether we want to use a 3rd party analyzer app, a separate service developed in-house or just an additional module of the current service (which can then expose an API to read and analyze the transactions).
The system already indexes the blockchain (to a scope limited extent)
and stores full transaction data. The analyzer can implement logic
such as decoding the `input` field of the transactions, parsing and
storing it in a more accessible way. Another example of additional
logic is pulling additional data about a given transaction and store
it in separate tables in the DB. Based on this information, additional
APIs can be implemented for ease of data consumption by client apps.

I'd be happy to discuss this into further details.
![tx-sync-service-analyzer.jpg](assets%2Ftx-sync-service-analyzer.jpg)

## Considerations
Since the scope of the task is small, I have put a hard limit of going
only 100 blocks back into the blockchain, when we pull transaction
data in a fresh database. Indexing the whole blockchain, from genesis
block, can take a lot of time and storage, so for the scope of the
task I deemed it not necessary. If the database is not fresh, though,
but the difference between the last stored block and the latest block
in the chain is bigger than 100 blocks, it will still sync everything
from the last stored block.

The indexing mechanism can be improved and made more sophisticated to
consider more scenarios like a crash while a given block is being
indexed and stored locally, because currently if that happens and not
all transactions of the chain are stored, upon restart the service
will see the latest block stored, not aware whether it's the full
block with all its transactions, and continue indexing from the next
block, thus missing some transactions of the last block.

The logic of storing indexed transactions can be optimized to store
the txs in batches instead of one by one.

When it comes to indexing & tracking a given address and its
transactions, I have skipped the implementation in the PoC service for
this logic, based on certain considerations and the limited scope of
the task. This logic can be approached in different ways. Since simple
transactions are not indexed, we can either (1) iterate over blocks (from genesis to latest or in a given range of blocks) and check
whether
they contain transactions for the given address, (2) use some kind of
an off-chain index (e.g. etherscan.io) or (3) build an indexer
ourselves (which we kind of are doing right now).

The `hash` column in
the transactions table is unique, so when indexing txs for a given
account, we can handle the scenario of duplicate txs and not store
them.
In terms of storage, I've described in TODO comments the scenario
where we store the txs for an address within the same table as the
overall indexed txs. Another approach would be to store the txs for a
given address in a separate table, though that would yield duplicate
data between this table and the one for overall blockchain txs. The
approach depends on the use-cases we want to have for utilizing this
data.

For simplicity and speed of development of the task, the development
environment is running locally on the machine instead of encapsulated
in a docker container, which would otherwise be the ideal scenario.
The docker container configuration provided is to show a simulation of
a production environment.

## Assumptions

The following assumptions I have communicated with Bassem before proceeding with the work on the task:

1. In the Problem Statements it is stated to "_design & implement
product-ready service_", but then in the Acceptance Criteria it is
stated to "_create a proof of concept service, that doesn't need to
have all the features to be production-ready_". Based on this
information I have made the assumption that I should create the design
for a production-ready system, but the actual implementation doesn't
have to be production-ready with all the features, and it can be quite
limited in terms of what is implemented.
And so, the system design and documentation is in a way more important
than the actual code and available features in the PoC implementation
2. In the Requirements it is stated that it should be possible to get
information for an address across different networks, but the
Acceptance Criteria says the service should only index the Goerli
testnet. Nevertheless, it was not difficult to implement indexing for
multiple networks (in the current implementation just two), so I have
taken the liberty to do so. Also, testnet and mainnet are treated as
the same network from data layer point of view, eg. both Goerli and
Ethereum are stored as "ETHEREUM" in the DB. This assumption was done
because in real situations applications serving testnet and mainnet
will ideally have separate DBs. Therefore, for the limited scope of the
task and for simplicity, the application and data layer are not aware
of the concept of testnet vs mainnet. The only difference is done on
configuration level (env vars).
3. The Requirements state that the system should have an adapter to
plug in any transaction analyzer to understand the transaction
internal details. This can be approached in a couple of different ways
  * system should be able to accept some 3rd party transaction
  analyzer tool
  * the system should be designed in such a generic way that a
  transaction analyzer could be implemented (as an internal tool by
  us) in order to consume data from the current system, eg. have an
  internal API that the analyzer could consume (as a separate service
  or as an internal module of the current system)

Referring back to assumption 1. and to the limited scope and time for
work on the task, I have omitted implementation of this part.
Nevertheless, I have described
