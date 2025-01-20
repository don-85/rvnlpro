// Web3 Initialization
let web3;
let userAccount;

// Smart Contract Addresses
const tokenSaleContractAddress = "0x7B0c86c738DEC59f7Fe5E849327640668454BBCb";
const usdtContractAddress = "0x55d398326f99059fF775485246999027B3197955";

// ABIs
const tokenSaleABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "usdtAmount", "type": "uint256" }],
    "name": "buyWithUSDT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const usdtABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Initialize Contracts
let tokenSaleContract, usdtContract;

// Detect Wallet Type and Initialize
async function initializeWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
  } else {
    alert("Please install a wallet like MetaMask, Trust Wallet, or use WalletConnect to connect.");
  }
}

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    await initializeWeb3();
    if (userAccount) {
      document.getElementById("walletAddress").innerText = `Wallet: ${userAccount}`;
      tokenSaleContract = new web3.eth.Contract(tokenSaleABI, tokenSaleContractAddress);
      usdtContract = new web3.eth.Contract(usdtABI, usdtContractAddress);
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Failed to connect wallet. Please try again.");
  }
});

// Approve USDT
document.getElementById("approveUSDT").addEventListener("click", async () => {
  try {
    const amount = web3.utils.toWei("1000000000", "ether");
    await usdtContract.methods.approve(tokenSaleContractAddress, amount).send({ from: userAccount });
    document.getElementById("message").innerText = "USDT Approved Successfully!";
  } catch (error) {
    document.getElementById("message").innerText = `Error: ${error.message}`;
  }
});

// Buy RVNL Tokens
document.getElementById("buyRVNL").addEventListener("click", async () => {
  try {
    const usdtAmount = document.getElementById("usdtAmount").value;
    const amountInWei = web3.utils.toWei(usdtAmount, "ether");
    await tokenSaleContract.methods.buyWithUSDT(amountInWei).send({ from: userAccount });
    document.getElementById("message").innerText = `Successfully bought RVNL Tokens for ${usdtAmount} USDT!`;
  } catch (error) {
    document.getElementById("message").innerText = `Error: ${error.message}`;
  }
});

// Add Token to Wallet
document.getElementById("addToken").addEventListener("click", async () => {
  const tokenAddress = "0xfd176df359fd5e0d05c863606fb9319b26c53aa5"; // RVNL Token Contract
  const tokenSymbol = "RVNL";
  const tokenDecimals = 18;
  const tokenImage = ""; // Optional: URL to a token logo image

  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // BEP-20 tokens use the ERC-20 standard
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      alert("RVNL token has been added to your wallet!");
    } else {
      alert("User declined to add RVNL token.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while trying to add the token.");
  }
});

// Particle JS Integration
particlesJS("particles-js", {
  particles: {
    number: { value: 100, density: { enable: true, value_area: 800 } },
    color: { value: "#21b9b2" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: true, speed: 3, size_min: 0.1, sync: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#21b9b2",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
});
