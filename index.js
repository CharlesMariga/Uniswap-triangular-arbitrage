const fs = require("fs");

const { ethers } = require("ethers");
const {
  abi: QuoterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

// Read file
function getFile(path) {
  try {
    const data = fs.readFileSync(path, "utf-8");
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

// Calculate arbitrage
function calculateArbitrage(amountIn, amountOut, surfaceObj) {
  // Calculate profit or loss
  const profitLoss = amountOut - amountIn;

  if (profitLoss > 0) {
    const profitLossPerc = (profitLoss / amountIn) * 100;
    const result = { ...surfaceObj, profitLossPerc, profitLoss };
    const { swap1, swap2, swap3 } = result;
    console.table([{ swap1, swap2, swap3, profitLoss, profitLossPerc }]);
  }
}

// Get price
async function getPrice(factory, amountIn, tradeDirection) {
  let amount = amountIn;
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/852308af2e4a4433b6a09bcd57d46392"
  );

  const abi = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
  ];

  const poolContract = new ethers.Contract(factory, abi, provider);

  //   Get pool token information
  const token0Address = await poolContract.token0();
  const token1Address = await poolContract.token1();
  const tokenFee = await poolContract.fee();

  //   Get individual token information (Symbol, name, decimals)
  const addressArray = [token0Address, token1Address];

  let tokenInfoArray = [];
  for (let i = 0; i < addressArray.length; i++) {
    const tokenAddress = addressArray[i];
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint)",
    ];
    const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

    let tokenSymbol = "";
    let tokenName = "";
    let tokenDecimals = 0;

    try {
      tokenSymbol = await contract.symbol();
      tokenName = await contract.name();
      tokenDecimals = await contract.decimals();
    } catch (err) {
      console.log("");
    }

    const obj = {
      id: "token" + i,
      tokenSymbol,
      tokenName,
      tokenDecimals,
      tokenAddress,
    };
    tokenInfoArray.push(obj);
  }

  //   Identify the correct token to input as A or B repectively
  let inputTokenA = "";
  let inputDecimalsA = 0;
  let inputTokenB = "";
  let inputDecimalsB = 0;

  if (tradeDirection === "base_to_quote") {
    inputTokenA = tokenInfoArray[0].tokenAddress;
    inputDecimalsA = tokenInfoArray[0].tokenDecimals;

    inputTokenB = tokenInfoArray[1].tokenAddress;
    inputDecimalsB = tokenInfoArray[1].tokenDecimals;
  } else {
    inputTokenA = tokenInfoArray[1].tokenAddress;
    inputDecimalsA = tokenInfoArray[1].tokenDecimals;

    inputTokenB = tokenInfoArray[0].tokenAddress;
    inputDecimalsB = tokenInfoArray[0].tokenDecimals;
  }

  //  Reformat amount in
  if (!isNaN(amount)) amount = amount.toString();
  amount = ethers.utils.parseUnits(amount, inputDecimalsA).toString();

  //   Get uniswap v3 quote
  const quoaterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
  const quoaterContract = new ethers.Contract(
    quoaterAddress,
    QuoterABI,
    provider
  );

  let quotedAmountedOut = 0;
  try {
    quotedAmountedOut = await quoaterContract.callStatic.quoteExactInputSingle(
      inputTokenA,
      inputTokenB,
      tokenFee,
      amount,
      0
    );
  } catch {
    console.log("");
  }

  //    Format output
  let outputAmount = ethers.utils
    .formatUnits(quotedAmountedOut, inputDecimalsB)
    .toString();

  return outputAmount;
}

// Get depth
async function getDepth(amountIn) {
  // GEt JSON surface rates
  console.log("Reading surface rate information...");
  let fileInfo = JSON.parse(getFile("uniswap_surface_rates.json"));
  let limit = 20;
  limit = fileInfo.length < limit ? fileInfo.length : limit;
  fileInfo = fileInfo.slice(0, limit);

  //   Loop through each trade and get price information
  for (let i = 0; i < fileInfo.length; i++) {
    //   Extract the variables
    const pair1ContractAddress = fileInfo[i].poolContract1;
    const pair2ContractAddress = fileInfo[i].poolContract2;
    const pair3ContractAddress = fileInfo[i].poolContract3;
    const trade1Direction = fileInfo[i].poolDirectionTrade1;
    const trade2Direction = fileInfo[i].poolDirectionTrade2;
    const trade3Direction = fileInfo[i].poolDirectionTrade3;

    // Trade 1
    // console.log("Checking trade 1 acquired coin...");
    const acquiredCoinT1 = await getPrice(
      pair1ContractAddress,
      amountIn,
      trade1Direction
    );

    // Trade 2
    if (acquiredCoinT1 === 0) return;
    // console.log("Checking trade 2 acquired coin...");
    const acquiredCoinT2 = await getPrice(
      pair2ContractAddress,
      acquiredCoinT1,
      trade2Direction
    );

    // Trade 3
    if (acquiredCoinT2 === 0) return;
    // console.log("Checking trade 3 acquired coin...");
    const acquiredCoinT3 = await getPrice(
      pair3ContractAddress,
      acquiredCoinT2,
      trade3Direction
    );

    // Calculate and show arbitrage
    calculateArbitrage(amountIn, acquiredCoinT3, fileInfo[i]);
  }
}

getDepth(10);
