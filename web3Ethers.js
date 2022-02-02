// const Web3 = require("web3");

// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://mainnet.infura.io/v3/852308af2e4a4433b6a09bcd57d46392"
//   )
// );

// const abi = [
//   {
//     constant: true,
//     inputs: [],
//     name: "mintingFinished",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_spender", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_from", type: "address" },
//       { name: "_to", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "unpause",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_to", type: "address" },
//       { name: "_amount", type: "uint256" },
//     ],
//     name: "mint",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "paused",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "_owner", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "balance", type: "uint256" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "finishMinting",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "pause",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "owner",
//     outputs: [{ name: "", type: "address" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_to", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_to", type: "address" },
//       { name: "_amount", type: "uint256" },
//       { name: "_releaseTime", type: "uint256" },
//     ],
//     name: "mintTimelocked",
//     outputs: [{ name: "", type: "address" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { name: "_owner", type: "address" },
//       { name: "_spender", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ name: "remaining", type: "uint256" }],
//     payable: false,
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "newOwner", type: "address" }],
//     name: "transferOwnership",
//     outputs: [],
//     payable: false,
//     type: "function",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "to", type: "address" },
//       { indexed: false, name: "value", type: "uint256" },
//     ],
//     name: "Mint",
//     type: "event",
//   },
//   { anonymous: false, inputs: [], name: "MintFinished", type: "event" },
//   { anonymous: false, inputs: [], name: "Pause", type: "event" },
//   { anonymous: false, inputs: [], name: "Unpause", type: "event" },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "owner", type: "address" },
//       { indexed: true, name: "spender", type: "address" },
//       { indexed: false, name: "value", type: "uint256" },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "from", type: "address" },
//       { indexed: true, name: "to", type: "address" },
//       { indexed: false, name: "value", type: "uint256" },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
// ];

// const address = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07";

// const TestContract = new web3.eth.Contract(abi, address);

// async function getWeb3Details() {
//   let tokenName = await TestContract.methods.name().call();
//   let tokenDecimals = await TestContract.methods.decimals().call();
//   let tokenSymbol = await TestContract.methods.symbol().call();
//   console.log(tokenName);
//   console.log(tokenDecimals);
//   console.log(tokenSymbol);
// }

// getWeb3Details();

// Ethers
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/852308af2e4a4433b6a09bcd57d46392"
);

const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint)",
];

const address = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07";

const omgContract = new ethers.Contract(address, abi, provider);

omgContract.name().then((name) => console.log(name));
omgContract.symbol().then((symbol) => console.log(symbol));
omgContract.decimals().then((decimals) => console.log(decimals.toString()));
