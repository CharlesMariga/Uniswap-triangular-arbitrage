const fs = require("fs");

const { ethers } = require("ethers");
const QuoterABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

// Read file
function getFile(path) {
  try {
    const data = fs.readFileSync(path, "utf-8");
    return data;
  } catch (err) {
    return [];
  }
}

// Get price
async function getPrice(factory, amountIn, tradeDirection) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/852308af2e4a4433b6a09bcd57d46392"
  );

  const abi = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
  ];

  const poolContract = new ethers.Contract(factory, abi, provider);

  const token0Address = await poolContract.token0();
  const token1Address = await poolContract.token1();
  const tokenFee = await poolContract.fee();

  console.log(token0Address, token1Address, tokenFee);
}

// Get depth
async function getDetph(amountIn, limit = 1) {
  // GEt JSON surface rates
  console.log("Reading surface rate information...");

  const fileInfo = JSON.parse(getFile("uniswap_surface_rates.json")).slice(
    0,
    limit
  );

  //   Loop through each trade and get price information
  fileInfo.forEach(async (el, index) => {
    //   Extract the variables
    const pair1ContractAddress = el.poolContract1;
    const pair2ContractAddress = el.poolContract2;
    const pair3ContractAddress = el.poolContract3;
    const trade1Direction = el.poolDirectionTrade1;
    const trade2Direction = el.poolDirectionTrade2;
    const trade3Direction = el.poolDirectionTrade3;

    // Trade 1
    console.log("Checking trade 1 acquired coin...");
    const acquiredCoinT1 = await getPrice(
      pair1ContractAddress,
      amountIn,
      trade1Direction
    );

    // Trade 2
    console.log("Checking trade 2 acquired coin...");

    // Trade 3
    console.log("Checking trade 3 acquired coin...");
  });

  return;
}

getDetph(1);
