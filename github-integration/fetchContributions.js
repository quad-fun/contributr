const Web3 = require('web3');
const axios = require('axios');
const schedule = require('node-schedule');
require('dotenv').config(); // Load environment variables from .env file

// Load GitHub token and account information from environment variables
const githubToken = process.env.GITHUB_TOKEN;
const githubUsername = process.env.GITHUB_USERNAME;
const githubRepo = process.env.GITHUB_REPO;


// Define constants for the contract address and account address
const contractAddress = process.env.CONTRACT_ADDRESS; // Add this line
const account = process.env.ACCOUNT_ADDRESS; = process.env.ACCOUNT_ADDRESS; // Add this line

const web3 = new Web3('http://localhost:8545'); // Connect to local blockchain node

// Define the ABI of the smart contract
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "repo",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "commitHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "author",
        "type": "string"
      }
    ],
    "name": "AttestationCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "repo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "commitHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "author",
        "type": "string"
      }
    ],
    "name": "createAttestation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getAttestation",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "repo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "commitHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "author",
            "type": "string"
          }
        ],
        "internalType": "struct ContributionAttestation.Attestation",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Replace with your actual contract and account addresses
const contract = new web3.eth.Contract(contractABI, contractAddress);
const account = process.env.ACCOUNT_ADDRESS;

// Function to fetch contributions from a GitHub repository
const fetchContributions = async (githubUsername, githubRepo) => {
  try {
    // Make a request to the GitHub API to fetch commits
    const response = await axios.get(`https://api.github.com/repos/${githubUsername}/${githubRepo}/commits`, {
      headers: {
        Authorization: `token ${githubToken}`
      }
    });
    return response.data; // Return the fetched commits
  } catch (error) {
    // Handle errors appropriately
    if (error.response) {
      console.error('Error fetching contributions:', error.response.data.message);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
};

// Function to process fetched contributions and create attestations
const processContributions = async () => {
  console.log('Fetching contributions...');
  // Fetch contributions using the specified GitHub username and repository
  const commits = await fetchContributions(githubUsername, githubRepo);
  if (commits) {
    for (const commit of commits) {
      try {
        // Extract necessary information from each commit
        const { sha, commit: { author, message } } = commit;
        // Create an attestation on the blockchain for each commit
        const tx = await contract.methods.createAttestation(githubRepo, sha, author.name).send({ from: account });
        console.log('Transaction:', tx.transactionHash);
      } catch (error) {
        console.error('Error sending transaction:', error);
      }
    }
  }
};

// Run the process immediately to initialize
processContributions();

// Schedule the job to run every day at midnight
schedule.scheduleJob('0 0 * * *', processContributions);

console.log('Scheduler started. Waiting for the next run...');
