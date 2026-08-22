System Architecture: How It Actually Works
The system operates across three distinct layers: the Local Node (Hospital), the Federated Aggregator (The Coordinator), and the Blockchain/Storage Layer (The Truth).

The Training Lifecycle (Step-by-Step):

Initialization: The global AI model (e.g., a baseline ResNet-50 for X-ray analysis) is stored on IPFS. Its CID (Content Identifier) is logged on the blockchain.

Local Training: Hospitals download the baseline model via IPFS. They run local training loops using their private patient datasets. Raw data never leaves the hospital's firewall.

Weight Extraction: Once a local training round is complete, the hospital's node extracts the gradients (the mathematical updates made to the model, not the data itself).

Decentralized Upload: The hospital uploads these gradients to IPFS, receiving a unique CID for their specific update.

On-Chain Submission: The hospital submits a blockchain transaction containing the IPFS CID of their gradients to a Smart Contract.

Aggregation: The Federated Learning Server listens to the blockchain. Once enough hospitals submit their updates, it pulls the gradients from IPFS, averages them (using algorithms like FedAvg), and creates a new, smarter Global Model.

Minting the Update: The new Global Model is uploaded to IPFS, and the Smart Contract is updated with the new baseline CID. Hospitals are rewarded with tokens for their contribution.

Required Tech Stack
To build a robust, portfolio-ready prototype, you want tools that bridge Python (for AI) and JavaScript/TypeScript (for Web3/UI).

1. Artificial Intelligence & Machine Learning
Deep Learning Framework: PyTorch. It gives granular control over model weights, which is strictly required for extracting gradients in Federated Learning.

Federated Learning Engine: Flower (flwr.dev). It is framework-agnostic, handles the complex networking between nodes, and manages the aggregation algorithms (like Federated Averaging).

Model Architecture: ResNet-50 or DenseNet121 (industry standards for medical image classification).

2. Blockchain & Web3 Infrastructure
Smart Contracts: Solidity. Used to write the logic for access control (who can train), update logging, and incentive distribution.

Development Framework: Hardhat or Foundry. For compiling, testing, and deploying your smart contracts locally before going to a testnet.

Network: Polygon Amoy Testnet. Fast block times and low fees make it perfect for testing. (In a real-world hospital setting, you would eventually migrate this to a private permissioned chain like Hyperledger Fabric).

Decentralized Storage: IPFS via Pinata. Pinata provides a simple API to pin your heavy .pth model files to the IPFS network so they don't get lost.

3. Full-Stack Web App (The Dashboard)
Frontend Framework: Next.js (React) with Tailwind CSS. For building a high-performance, visually clean dashboard for hospital administrators to track training rounds and model accuracy.

Web3 Integration: Viem or Ethers.js. To connect the hospital's MetaMask wallet to the dashboard and interact with your smart contracts.

Backend API (Optional but recommended): FastAPI (Python). Serves as a bridge if your Next.js frontend needs to query specific metrics directly from your Flower server.

Core Features to Build
To make the project complete, focus on implementing these specific features:

Role-Based Access Control (RBAC) via Smart Contract: Ensure only whitelisted wallet addresses (verified hospitals) can submit model updates.

Audit Trail: A UI view that fetches blockchain event logs, showing exactly which hospital contributed to which version of the model, complete with timestamps.

Model Evaluation Metrics: A dashboard graph plotting the global model's accuracy and loss over time as more federated rounds are completed.

Incentive Mechanism: A custom ERC-20 token (e.g., $MEDAI) automatically minted and transferred to hospitals upon successful gradient submission.

Recommended Development Phases
Breaking this down will prevent integration hell:

Phase 1: Pure AI. Build the PyTorch model and get Flower running locally with two simulated Python clients. Ensure the model actually learns.

Phase 2: Smart Contracts & IPFS. Write the Solidity contract. Write a Python script that takes a dummy file, uploads it to Pinata (IPFS), and submits the hash to your local Hardhat blockchain.

Phase 3: The Integration. Connect Phase 1 and 2. Have your Flower clients automatically trigger the IPFS/Blockchain upload when a training round finishes.

Phase 4: The Interface. Build the Next.js frontend to visualize the system.