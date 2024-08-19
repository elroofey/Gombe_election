// Connect to the blockchain
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

// Contract ABI and address
const contractABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "name": "id",
        "type": "uint256"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "candidateCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = "0xdd3eBcD3ade60587442f99A5E167090cD100B317";

const electionContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add a candidate
async function addCandidate(name) {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.addCandidate(name).send({ from: accounts[0] });
}

// Function to vote for a candidate
async function vote(candidateId) {
  const accounts = await web3.eth.getAccounts();
  await electionContract.methods.vote(candidateId).send({ from: accounts[0] });
}

// Function to get candidate details
async function getCandidate(candidateId) {
  return await electionContract.methods.candidates(candidateId).call();
}

// Function to get candidate count
async function getCandidateCount() {
  return await electionContract.methods.candidateCount().call();
}

// Populate candidate list in the dropdown
async function populateCandidates() {
  const candidateSelect = document.getElementById("candidateSelect");
  candidateSelect.innerHTML = ''; // Clear existing options

  const candidateCount = await getCandidateCount();
  for (let i = 1; i <= candidateCount; i++) {
    const candidate = await getCandidate(i);
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = candidate.name;
    candidateSelect.appendChild(option);
  }
}

// Handle voting
document.getElementById("voteButton").addEventListener("click", async () => {
  const candidateId = document.getElementById("candidateSelect").value;
  await vote(candidateId);
  document.getElementById("voteMessage").textContent = "Voted successfully!";
});

// Handle getting results
document.getElementById("resultsButton").addEventListener("click", async () => {
  const candidateCount = await getCandidateCount();
  const results = [];
  for (let i = 1; i <= candidateCount; i++) {
    const candidate = await getCandidate(i);
    results.push(`${candidate.name}: ${candidate.voteCount} votes`);
  }
  document.getElementById("results").innerHTML = results.join('<br>');
});

// Populate candidates on page load
window.onload = populateCandidates;
