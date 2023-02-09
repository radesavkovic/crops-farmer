import $ from 'jquery';
import Web3 from 'web3';
import minerAbi from "../contracts/abi.json";

var currentAddr = null;
var web3;
var spend;
var usrBal;
var priceInUSD;
var lastNumEggs=-1
var lastNumMiners=-1
var lastSecondsUntilFull=100
var lastHatchTime=0
var eggstohatch1=0
var maxDeposit=0
var minDeposit=0
var totalDeposits=0
var lastUpdate = new Date().getTime()
var contractBalance;

var compoundPercent=0;
var compoundMaxDays=0;
var compoundCount=0;
var compoundStep=0;
var cutoffStep=0;
var withdrawCooldown=0;

var contract;

const minerAddress = '0xF0D6fF5D26f205E2e0ef8543E335F08Bada4B3C5'; //testnet contract
// const minerAddress = '0xA4BE7B9F36495d07a1B1753C38CabC286af53757'; //testnet contract
// const tokenAddress = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7'; //testnet BUSD
// const minerAddress = '0x8be8881C641Dc5A40845253Ee3eD04955eDFe96D'; //mainnet contract   
// const tokenAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'; //mainnet BUSD

var tokenContract;
var started = true;
var canSell = true;

// const tokenAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

// const minerAbi = [{"inputs":[{"internalType":"address","name":"_dev1","type":"address"},{"internalType":"address","name":"_dev2","type":"address"},{"internalType":"address","name":"_dev3","type":"address"},{"internalType":"address","name":"_dev4","type":"address"},{"internalType":"address","name":"_mkt","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"BONUS_COMPOUND_STEP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"BONUS_DAILY_COMPOUND","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"BONUS_DAILY_COMPOUND_BONUS_MAX_TIMES","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_DEV1","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_DEV2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_DEV3","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_MKT_WALLET","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_OWNERSHIP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"COMPOUND_BONUS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COMPOUND_BONUS_MAX_TIMES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COMPOUND_FOR_NO_TAX_WITHDRAWAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"COMPOUND_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CUTOFF_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EGGS_TO_HIRE_1MINERS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKET_EGGS_DIVISOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MARKET_EGGS_DIVISOR_SELL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_INVEST_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENTS_DIVIDER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_EGGS_TO_HIRE_1MINERS","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_MARKET_EGGS_DIVISOR","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_REFERRAL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_TAX","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"REFERRAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_COMPOUND_FOR_NO_TAX_WITHDRAWAL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_CUTOFF_STEP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_MIN_INVEST_LIMIT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_WALLET_DEPOSIT_LIMIT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_WITHDRAWAL_TAX","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_WITHDRAW_COOLDOWN","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"TAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WALLET_DEPOSIT_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WITHDRAWAL_TAX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WITHDRAW_COOLDOWN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ref","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"eth","type":"uint256"},{"internalType":"uint256","name":"contractBalance","type":"uint256"}],"name":"calculateEggBuy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eth","type":"uint256"}],"name":"calculateEggBuySimple","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"eggs","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculateEggSellForYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rt","type":"uint256"},{"internalType":"uint256","name":"rs","type":"uint256"},{"internalType":"uint256","name":"bs","type":"uint256"}],"name":"calculateTrade","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dev1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dev2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dev3","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dev4","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getAvailableEarnings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getDailyCompoundBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"getEggsSinceLastHatch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"getEggsYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyEggs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyMiners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSiteInfo","outputs":[{"internalType":"uint256","name":"_totalStaked","type":"uint256"},{"internalType":"uint256","name":"_totalDeposits","type":"uint256"},{"internalType":"uint256","name":"_totalCompound","type":"uint256"},{"internalType":"uint256","name":"_totalRefBonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTimeStamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_initialDeposit","type":"uint256"},{"internalType":"uint256","name":"_userDeposit","type":"uint256"},{"internalType":"uint256","name":"_miners","type":"uint256"},{"internalType":"uint256","name":"_claimedEggs","type":"uint256"},{"internalType":"uint256","name":"_lastHatch","type":"uint256"},{"internalType":"address","name":"_referrer","type":"address"},{"internalType":"uint256","name":"_referrals","type":"uint256"},{"internalType":"uint256","name":"_totalWithdrawn","type":"uint256"},{"internalType":"uint256","name":"_referralEggRewards","type":"uint256"},{"internalType":"uint256","name":"_dailyCompoundBonus","type":"uint256"},{"internalType":"uint256","name":"_lastWithdrawTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"isCompound","type":"bool"}],"name":"hatchEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"marketEggs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mkt","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sellEggs","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token_BUSD","outputs":[{"internalType":"contract IToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCompound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRefBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWithdrawn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"initialDeposit","type":"uint256"},{"internalType":"uint256","name":"userDeposit","type":"uint256"},{"internalType":"uint256","name":"miners","type":"uint256"},{"internalType":"uint256","name":"claimedEggs","type":"uint256"},{"internalType":"uint256","name":"lastHatch","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referralsCount","type":"uint256"},{"internalType":"uint256","name":"referralEggRewards","type":"uint256"},{"internalType":"uint256","name":"totalWithdrawn","type":"uint256"},{"internalType":"uint256","name":"dailyCompoundBonus","type":"uint256"},{"internalType":"uint256","name":"lastWithdrawTime","type":"uint256"}],"stateMutability":"view","type":"function"}]

// const { wrongNetwork, getBnbBalance, fromWei, toWei} = useContractContext();

// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(minerAbi, minerAddress);
    // tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    console.log('Done loading contracts.')
}

function myReferralLink(address) {
    var prldoc = document.getElementById('reflink')
    prldoc.textContent = window.location.origin + "?ref=" + address
    var copyText = document.getElementById("reflink");
    copyText.value = prldoc.textContent
}

export async function connect() {
    console.log('Connecting to wallet...')
    // return;
    try {
        if (started) {
            $('#buy-eggs-btn').attr('disabled', false);
            // $('#buy-eggs-btn').attr('value', "100");
            console.log("[mcb] => disabled false");
        }
        await window.ethereum.enable();
        var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect')
        } else if (accounts[0] !== currentAddr) {
            currentAddr = accounts[0];
            if (currentAddr !== null) {
                myReferralLink(currentAddr)
                console.log('Wallet connected = '+ currentAddr)

                loadContracts()
                refreshData()

                let shortenedAccount = currentAddr.replace(currentAddr.substring(3, 39), "**")
                $('#enableMetamask').html(shortenedAccount)
            }
            $('#enableMetamask').attr('disabled', true)
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
        $('#enableMetamask').attr('disabled', false)
    }
}

async function loadWeb3() {
    console.log("loadWeb3...");
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        $('#enableMetamask').attr('disabled', false)
        if (window.ethereum.selectedAddress !== null) {
            await connect();
                setTimeout(function () {
                controlLoop()
                controlLoopFaster()
            }, 1000)
        }
    } else {
        $('#enableMetamask').attr('disabled', true)
    }
}

window.addEventListener('load', function () {
    setStartTimer();
    console.log("xxxxxxxxxxxxxxxxxxxxxx");
    loadWeb3()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    setTimeout(controlLoop, 25000)
}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0};
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    console.log('Refreshing data...')
    // try {
    //     tokenPrice(function(busdPrice){
    //         var priceJson = JSON.parse(busdPrice)
    //         priceInUSD = +priceJson['binancecoin']['usd'];
    //     });
    // } catch { priceInUSD = 0; }

    contract.methods.EGGS_TO_HIRE_1MINERS().call().then(eggs => {
        eggstohatch1 = eggs
        var dailyPercent = Number((86400 / eggstohatch1) * 100).toFixed(2);
        var apr = dailyPercent * 365;
        $("#daily-rate").html(` ${dailyPercent}% Daily ~ ${apr}% APR`);
    }).catch((err) => {
        console.log('EGGS_TO_HIRE_1MINERS', err);
    });

    contract.methods.COMPOUND_BONUS().call().then(r => {
        compoundPercent = r / 10;
        $("#daily-compound").html(` ${compoundPercent}% Daily Hire Bonus`)
        $("#compound-percent").html(` ${compoundPercent}%`)
    }).catch((err) => {
        console.log('COMPOUND_BONUS', err);
    });

    contract.methods.CUTOFF_STEP().call().then(cutoff => {
        cutoffStep = cutoff;
	$("#cut-off-step").html(` ${cutoffStep / 3600}`)
    }).catch((err) => {
        console.log('CUTOFF_STEP', err);
    })

    contract.methods.WITHDRAW_COOLDOWN().call().then(cooldown => {
        withdrawCooldown = cooldown;
	$("#withdraw-cooldown").html(` ${withdrawCooldown / 3600}`)
    }).catch((err) => {
        console.log('WITHDRAW_COOLDOWN', err);
    })

    contract.methods.REFERRAL().call().then(r => {
        var refPercent = Number(r / 10).toFixed(0);
        $("#ref-bonus").html(` ${refPercent}% Referral Bonus`)
        $("#ref-percent").html(` ${refPercent}%`)
    }).catch((err) => {
        console.log('REFERRAL', err);
    });

    contract.methods.COMPOUND_BONUS_MAX_TIMES().call().then(r => {
        compoundMaxDays = r;
        var maxCompoundPercent = r*compoundPercent;
        $("#max-compound").html(`+${maxCompoundPercent}%`)
    }).catch((err) => {
        console.log('COMPOUND_BONUS_MAX_TIMES', err);
    });
	
	contract.methods.COMPOUND_FOR_NO_TAX_WITHDRAWAL().call().then(r => {
        compoundCount = r;
        var maxCompoundForNoTax = compoundCount;
	console.log('maxCompoundForNoTax = ' + maxCompoundForNoTax)
        $("#no-tax-compound-count").html(` ${maxCompoundForNoTax}`)
    }).catch((err) => {
        console.log('COMPOUND_FOR_NO_TAX_WITHDRAWAL', err);
    });

    contract.methods.WALLET_DEPOSIT_LIMIT().call().then(busd => {
        maxDeposit = busd;
        $("#max-deposit").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('WALLET_DEPOSIT_LIMIT', err);
    });
	
	contract.methods.MIN_INVEST_LIMIT().call().then(busd => {
        minDeposit = busd;
        $("#min-deposit").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('MIN_INVEST_LIMIT', err);
    });

    contract.methods.COMPOUND_STEP().call().then(step => {
        compoundStep = step;
	$("#compound-hours").html(` ${compoundStep / 3600}`)
    }).catch((err) => {
        console.log(err);
    });

     /** How many miners and eggs per day user will recieve for 100 BUSD deposit **/
    contract.methods.getEggsYield(web3.utils.toWei('100')).call().then(result => {
        var miners = result[0];
        var busd = result[1];
        var amt = readableBUSD(busd, 4);

        $("#example-miners").html(miners)
        $("#example-busd").html(roundNum(amt))
        // var usd = Number(priceInUSD*amt).toFixed(2);
        // $("#example-usd").html(usd)
    }).catch((err) => {
        console.log('getEggsYield', err);
    });

	web3.eth.getBalance(currentAddr).then((userBalance) => {
    // tokenContract.methods.balanceOf(currentAddr).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#user-balance').html(roundNum(amt))
        // calcNumTokens(roundNum(amt)).then(usdValue => {
        //     $('#user-balance-usd').html(roundNum(usdValue))
        // })
    }).catch((err) => {
        console.log('balanceOf', err)
    });

    // tokenContract.methods.allowance(currentAddr, minerAddress).call().then(result => {
    //     spend = web3.utils.fromWei(result)
    //     if (spend > 0 && started) {
    //         $('#user-approved-spend').html(roundNum(spend));
    //         // calcNumTokens(spend).then(usdValue => {
    //         //     $('#user-approved-spend-usd').html(usdValue)
    //         // })
    //         $("#buy-eggs-btn").attr('disabled', false);
    //         $("#busd-spend").attr('hidden', false);
    //         $("#busd-spend").attr('value', "100");
    //     }
    // }).catch((err) => {
    //     console.log('allowance', err)
    // });

    if (started) {
        contract.methods.getBalance().call().then(balance => {
            contractBalance = balance;
            var amt = web3.utils.fromWei(balance);
            $('#contract-balance').html(roundNum(amt));
            // var usd = Number(priceInUSD*amt).toFixed(2);
            // $("#contract-balance-usd").html(usd)
        }).catch((err) => {
            console.log(err);
        });

        contract.methods.getSiteInfo().call().then(result => {
            var staked = web3.utils.fromWei(result._totalStaked);
            $('#total-staked').html(roundNum(staked));	
            //$('#total-staked').html(staked);
            // var stakedUSD = Number(priceInUSD*staked).toFixed(2);
            // $("#total-staked-usd").html(stakedUSD)
            $('#total-players').html(result._totalDeposits);
            var ref = result._totalRefBonus;
            if (ref > 0) {
                var refBUSD = readableBUSD(ref, 2);
                $("#total-ref").html(refBUSD);
                // var refUSD = Number(priceInUSD*refBUSD).toFixed(2);
                // $('#total-ref-usd').html(refUSD)
            }
        }).catch((err) => {
            console.log('getSiteInfo', err);
        });
    }

    // web3.eth.getBalance(currentAddr).then(userBalance => {
    //     usrBal = userBalance;
    //     var amt = web3.utils.fromWei(userBalance);
    //     $("#user-balance").html(roundNum(amt));
    //     var usd = Number(priceInUSD*amt).toFixed(2);
    //     $("#user-balance-usd").html(usd)
    // }).catch((err) => {
    //     console.log(err);
    // });

    contract.methods.getUserInfo(currentAddr).call().then(user => {
        var initialDeposit = user._initialDeposit;
        var userDeposit = user._userDeposit;
        var miners = user._miners;
        var totalWithdrawn = user._totalWithdrawn;
        var lastHatch = user._lastHatch;
        var referrals = user._referrals;
        var referralEggRewards = user._referralEggRewards;
        var dailyCompoundBonus = user._dailyCompoundBonus;
        var withdrawCount = user._withdrawCount;
        var lastWithdrawTime = user._lastWithdrawTime;

        console.log('last withdraw time = ' + lastWithdrawTime)

        var now = new Date().getTime() / 1000;

        var diff = (+lastHatch + +compoundStep) - now;
        if (diff > 0) {
            setCompoundTimer(lastHatch);
        } else {
            $(".compound-timer").text("00:00:00");
            $('#reinvest').attr('disabled', false)
        }
        var extraPercent = 0;
        console.log('dailyCompoundBonus = ' + dailyCompoundBonus)
	$("#compound-count").html(`${dailyCompoundBonus} Times`);
        if (dailyCompoundBonus > 0) {
            extraPercent += dailyCompoundBonus * compoundPercent;
            $("#compound-bonus").html(`+${extraPercent}%`);
        } else {
            $("#reinvest").text("Hire More Farmers");
        }

        var cutOffDiff = (+lastHatch + +cutoffStep) - now;
        if (cutOffDiff > 0) {
            setCutoffTimer(lastHatch)
        } else {
            $("#claim-timer").html("00:00:00")
        }

        var coolDownDiff = (+lastHatch + +withdrawCooldown) - now;
        if (coolDownDiff > 0) {
            setCooldownTimer(coolDownDiff)
        } else {
            $("#cooldown-timer").html("");
            $("#withdraw").attr('disabled', false);
        }

        if (miners > 0) {
            $("#your-miners").html(miners);
            contract.methods.getAvailableEarnings(currentAddr).call().then(function (earnings) {
                var busdMined = readableBUSD(earnings, 4)
                $("#mined").html(busdMined);
                // var minedUsd = Number(priceInUSD*busdMined).toFixed(2);
                // $('#mined-usd').html(minedUsd)
            }).catch((err) => {
                console.log('getAvailableEarnings', err);
                throw err;
            });
        } else {
            $("#mined").html(0);
        }

        if (referralEggRewards > 0) {
            var refBUSD = readableBUSD(referralEggRewards, 2);
            $("#ref-rewards-busd").html(refBUSD);
            // var refUSD = Number(priceInUSD*refBUSD).toFixed(2);
            // $('#ref-rewards-usd').html(refUSD)
            $('#ref-count').html(referrals);
        } else {
            $("#ref-rewards").html("0".concat(' '.concat('Miners')));
        }

        setInitialDeposit(initialDeposit);
        setTotalDeposit(userDeposit);
        setTotalWithdrawn(totalWithdrawn);


        if (miners > 0) {
            var eggsPerDay = 24*60*60 * miners ;
            contract.methods.calculateEggSellForYield(eggsPerDay, web3.utils.toWei('100')).call().then(earnings => {
                var eggsBUSD = readableBUSD(earnings, 4)
                $("#eggs-per-day").html(eggsBUSD);
                // var eggsUSD = Number(priceInUSD*eggsBUSD).toFixed(2);
                // $('#eggs-per-day-usd').html(eggsUSD)
            }).catch((err) => {
                console.log('calculateEggSellForYield', err);
                throw err;
            });
        }
	    //if dailyCompoundBonus < 5
        if (parseInt(dailyCompoundBonus) < parseInt(compoundCount)) {
            contract.methods.WITHDRAWAL_TAX().call().then(tax => {
                $("#withdraw-tax").html(`(-${tax/10}% tax)`)
		console.log('dailyCompoundBonus < compoundCount = true');   
            }).catch((err) => {
                console.log('WITHDRAWAL_TAX', err);
                throw err;
            });
        } else {
            $('#withdraw-tax').attr('hidden', true)
	    console.log('dailyCompoundBonus < compoundCount = false'); 
        }
    }).catch((err) => {
        console.log('getUserInfo', err);
    });

    updateBuyPrice();
    console.log('Done refreshing data...')
}

export function copyRef() {
    console.log("[mcb]: copyRef");
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#reflink').text()).select();
    document.execCommand("copy");
    $temp.remove();
    $("#copied").html("<i class='ri-checkbox-circle-line'> copied!</i>").fadeOut('10000ms')
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function setInitialDeposit(initialDeposit) {
    totalDeposits = initialDeposit;
    var initialBUSD = readableBUSD(initialDeposit, 2);
    // var initialUSD = Number(priceInUSD*initialBUSD).toFixed(2);
    $("#initial-deposit").html(initialBUSD);
    // $("#initial-deposit-usd").html(initialUSD);
}

function setTotalDeposit(totalDeposit) {
    var totalBUSD = readableBUSD(totalDeposit, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#total-deposit").html(totalBUSD);
    // $("#total-deposit-usd").html(totalUSD);
}

function setTotalWithdrawn(totalWithdrawn) {
    var totalBUSD = readableBUSD(totalWithdrawn, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#total-withdrawn").html(totalBUSD);
    // $("#total-withdrawn-usd").html(totalUSD);
}

var x;
function setCompoundTimer(lastHatch) {
    $('#reinvest').attr('disabled', true)
    var now = new Date().getTime();
    var diff = (+lastHatch + +compoundStep) - (now / 1000);
    var countDownDate = new Date(+now + +diff * 1000).getTime();

    clearInterval(x)
    x = setInterval(function () {
        var currTime = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - currTime;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);


        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#compound-timer").html(`${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            $("#compound-timer").html("<span>00:00:00</span>");
            $('#reinvest').attr('disabled', false)
        }
    }, 1000, 1);
}

let y;
function setCutoffTimer(lastHatch) {
    var time = new Date().getTime();
    var cutoff = (+lastHatch + +cutoffStep) - (+time/1000);
    var countDownDate = new Date(+time + +cutoff * 1000).getTime();

    clearInterval(y)
    y = setInterval(function() {
        var currentTime = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - currentTime;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#claim-timer").html(`<strong>${hours}h:${minutes}m:${seconds}s</strong>`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(y);
            $("#claim-timer").html("<span>0:00:00</span>");
        }
    }, 1000, 1);
}

var z;
function setCooldownTimer(cooldown) {
    $("#withdraw").attr('disabled', true);
    var time = new Date().getTime();
    var endDate = new Date(+time + +cooldown * 1000).getTime();

    clearInterval(z)
    z = setInterval(function() {
        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)  + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#cooldown-timer").html(`in ${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(z);
            $("#withdraw").attr('disabled', false);
            $("#cooldown-timer").html("");
        }
    }, 1000, 1);
}

var startTimeInterval;
function setStartTimer() {
    var endDate = new Date('April 18, 2022 9:00 EST').getTime();

    clearInterval(startTimeInterval)
    startTimeInterval = setInterval(function() {
        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	if (days < 10) { days = '0' + days; }
        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#start-timer").html(`${days}d:${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(startTimeInterval);
            $("#start-container").remove();
            started = true;
            refreshData()
        }
    }, 1000, 1);
}

export function updateBuyPrice(busd) {
    console.log("[mcb]=>onChange", busd);
    if (busd == undefined || !busd) {
        busd = document.getElementById('busd-spend').value;
    }
    contract.methods.calculateEggBuySimple(web3.utils.toWei(busd)).call().then(eggs => {
        $("#eggs-to-buy").html(parseFloat(eggs/eggstohatch1).toFixed(2));
    });
}

// function approve(_amount) {
//     let amt;
//     if (_amount != 0) {
//         amt = +spend + +_amount;
//     }
//     else {
//         amt = 0
//     }
//     let _spend = web3.utils.toWei(amt.toString())
//     tokenContract.methods.approve(minerAddress, _spend).send({ from: currentAddr }).then(result => {
//         if (result) {
//             $('#busd-spend').attr('disabled', false);
//             $('#buy-eggs-btn').attr('disabled', false);
//             $('#buy-eggs-btn').attr('value', "100");
//             refreshData();
//         }

//     }).catch((err)=> {
//         console.log(err)
//     });
// }

// export async function approveMiner() {
//     console.log("[mcb]=>approveMiner");
//     let spendDoc = document.getElementById("approve-spend");
//     let _amount = spendDoc.value;
//     approve(_amount);
// }


export function hireFarmers() {
    console.log("[mcb] => hireFarmers()");
    var spendDoc = document.getElementById('busd-spend')
    var busd = spendDoc.value;
	
    var amt = web3.utils.toWei(busd);
	if(+amt < +minDeposit) {
		alert(`you cannot deposit less than ${readableBUSD(minDeposit, 2)} BUSD`);
        return
    }
	
	var amt = web3.utils.toWei(busd);
	if(+amt + +totalDeposits > +maxDeposit) {
		alert(`you cannot deposit more than ${readableBUSD(maxDeposit, 2)} BUSD`);
        return
    }
	
    if(+amt > usrBal) {
		alert("you do not have " + busd + " BUSD in your wallet");
        return
    }
    // if (+spend < +busd) {
    //     var amtToSpend = busd - spend;
    //     alert("you first need to approve " + amtToSpend + " BUSD before depositing");
    //     return
    // }

    let ref = getQueryVariable('ref');
    if (busd > 0) {
        if (!web3.utils.isAddress(ref)) { ref = currentAddr }
        contract.methods.hireFarmers(ref).send({ value: amt, from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
    }
}

export function hireMoreFarmers() {
    if (canSell) {
        canSell = false;
        console.log(currentAddr)
        contract.methods.hireMoreFarmers(true).send({ from: currentAddr}).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot hatch yet...')
    }
}

export function sellCrops() {
    if (canSell) {
        canSell = false;
        console.log('Selling');
        contract.methods.sellCrops().send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot sell yet...')
    }
}

function getBalance(callback){
    contract.methods.getBalance().call().then(result => {
        callback(result);
    }).catch((err) => {
        console.log(err)
    });
}

function tokenPrice(callback) {
	const url = "https://api.coingecko.com/api/v3/simple/price?ids=binanceusd&vs_currencies=usd";
	httpGetAsync(url,callback);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.reBUSDnseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function readableBUSD(amount, decimals) {
  return (amount / 1e18).toFixed(decimals);
}
