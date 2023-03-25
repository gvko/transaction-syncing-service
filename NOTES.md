## Design
This backend app is designed with domain separation in mind.
I've chosen NestJS as framework since it is opinionated in a way that pushes the architecture to be separated by logical domains.

The app is quite simple, so I've separated it in just two domains: the Transaction module, which takes care of the transaction entity and all logic surrounding it (data layer, presentation layer and business logic). The second module is the Web3Provider, which takes care of all the interaction with the blockchain, thus abstracting any of that logic from the Transaction module (or any other possible modules).
This way the codebase stays clean and well separated.

Upon start, the service pulls transaction data from the blockchain by iterating over given blocks, parsing and storing the tx data in the provided database. It will check what was the biggest block of any transaction and start syncing transactions from there until the latest block in the chain. After the sync of past transactions is done, it will subscribe to listen for incoming new blocks and sync them automatically. This works for multiple chains asynchronously (currently only Ethereum and Polygon). Whether mainnet or testnet depends on the node URL provided as env vars.
This mechanism will allow for backfill of missed transactions in case of a system crash.

## Considerations
Since the scope of the task is small, I have put a hard limit of going only 100 blocks back into the blockchain, when we pull transaction data in a fresh database. Indexing the whole blockchain, from genesis block, can take a lot of time and storage, so for the scope of the task I deemed it not necessary. If the database is not fresh, though,
but the difference between the last stored block and the latest block in the chain is bigger than 100 blocks, it will still sync everything from the last stored block.

## Assumptions
