## Proof of Passport - merkle-tree-reader

This repository provides a server which can be requested to retrieve the whole merkle tree from ProofOfPassport smart contracts.

# How to use it

| Command      | Description   |
|--------------|---------------|
| `yarn start` | start the app |
| `yarn stop`  | stop the app  |
| `yarn restart` | restart the app |

# Enpoints

| Endpoint                    | Description                                           |
|-----------------------------|-------------------------------------------------------|
| `/api/update-merkle-tree`   | Updates the merkle tree by executing a script         |
| `/api/download`             | Downloads the serialized merkle tree JSON file        |
| `/api/download-merkle-tree` | Executes a script and downloads the updated merkle tree JSON  |
