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
| `/api/download-merkle-tree` | Executes a script and downloads the updated serialized merkle tree JSON file  |

# Current set-up

The server is currently set on an AWS EC2 instance.

| Public IP | 34.222.134.21 |
| Open Port | 3000 |

Execute the command locally:
```bash
curl -O -J http://34.222.134.21:3000/api/download-merkle-tree
```

