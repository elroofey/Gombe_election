window.addEventListener('load', async () => {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
  
    const contractABI = [ 
        {
            "constant": true,
            "inputs": [],
            "name": "candidatesCount",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
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
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "candidateId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "name",
                "type": "string"
              },
              {
                "indexed": false,
                "name": "voteCount",
                "type": "uint256"
              }
            ],
            "name": "CandidateAdded",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "name": "candidateId",
                "type": "uint256"
              }
            ],
            "name": "Voted",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_name",
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
                "name": "_candidateId",
                "type": "uint256"
              }
            ],
            "name": "vote",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ];
    const contractAddress = "0xdd3eBcD3ade60587442f99A5E167090cD100B317";
    const electionContract = new web3.eth.Contract(contractABI, contractAddress);
  
    const candidateSelect = document.getElementById('candidateSelect');
    const voteButton = document.getElementById('voteButton');
    const resultsButton = document.getElementById('resultsButton');
    const voteMessage = document.getElementById('voteMessage');
    const resultsDiv = document.getElementById('results');
  
    voteButton.addEventListener('click', async () => {
      const selectedCandidate = candidateSelect.value;
      const accounts = await web3.eth.getAccounts();
      await electionContract.methods.vote(parseInt(selectedCandidate)).send({ from: accounts[0] });
      voteMessage.textContent = "Voted successfully!";
    });
  
    resultsButton.addEventListener('click', async () => {
      let resultsHTML = '';
      for (let i = 1; i <= 3; i++) {
        const candidate = await electionContract.methods.getCandidate(i).call();
        resultsHTML += `<p>Candidate ${i}: ${candidate[0]}, Votes: ${candidate[1]}</p>`;
      }
      resultsDiv.innerHTML = resultsHTML;
    });
  });
  