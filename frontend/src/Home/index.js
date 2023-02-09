import { fontSize, styled } from "@mui/system";
import Grid from "@mui/material/Grid";
// import Connect from "./components/Connect";
import Header from "./components/Header";
import BakeCard from "./components/BakeCard";
import RewardsInfo from "./components/RewardsInfo";
import ContractInfoCard from "./components/ContractInfo";
import ProfitInfoCard from "./components/ProfitInfo";
import ReferralLink from "./components/ReferralLink";
import { useAuthContext } from "../providers/AuthProvider";
import Footer from "./components/Footer";
import imgLogo from '../assets/logo.png';
import nutritionImage from '../assets/nutrition.jpg';
// import imgRat from '../assets/'
import { config } from "../config";
import esIcon from "../assets/ESIcon.png";
import tgIcon from "../assets/TGIcon.png";
import twIcon from "../assets/TWIcon.png";
import img1 from "../assets/img1.png"
import { connect, hireFarmers, hireMoreFarmers, sellCrops, copyRef, updateBuyPrice } from './main_eth';
import "./myStyle.css"
import "./bootstrap-icons/bootstrap-icons.css"
import "./boxicons/css/boxicons.min.css"
import "./remixicon/remixicon.css"
import { Accordion, Col, Row } from "react-bootstrap";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from "react";

const faqData = [
  {
    title: `What is the BNB KingDom?`,
    content: 
    <div
      id="faq-list-1"
      class="collapse show"
      data-bs-parent=".faq-list"
    >
      <p>
        The BNB KingDom is a decentralized application built on the Binance Smart Chain. 
        The object of the game is to hire more farmers sooner and more often than other players. This in turn earns you more BNB faster. 
        These Farmers work for you tirelessly, giving you a daily average of 8% of your farmers' value.
      </p>
      <p>
        The daily percentage return depends on players' actions that are taken within the platform that impact the farmers's efficiency rate. 
        The farming efficiency rate rises and falls as users buy Farmers, re-hire your earnings and sell your Crops for BNB.
      </p>
      <p>
        Once Farmers are Bought, they cannot be sold, and the investment made to re-hire them (either through hire or re-hiring) cannot be taken back. 
        However, once bought, Farmers will not stop producing yield.
      </p>
    </div>,
  },
  {
    title: `What makes it different from other similar platforms?`,
    content: <div
        id="faq-list-2"
        class="collapse show"
        data-bs-parent=".faq-list"
      >
        <p> The BNB KingDom has several anti-dumping and anti-whale measures in place to ensure the longevity of the project. 
        These measures include maximum deposits, as well as a cutoff time AND a cooldown time for withdrawals.
        </p>
        <p>
        The cutoff time is the amount of time it will take for your "cart" to be full of rewards. 
        Once the bag is full, it will stop filling until you've taken some action in the game. 
        This is to prevent whales from letting their rewards accumulate for a long time, 
        and removes the false impression the contract value is going up when most of it is rewards the whale is waiting to withdraw at once.
        </p>
        <p>
        The withdraw cooldown time is the amount of time one has to wait before they can make another withdrawal. 
        This also prevents the contract balance from decreasing in value too fast. 
        If the team decides it's necessary to protect the contract balance, 
        this time period can be adjusted to slow down the rate of withdrawals, 
        but it can only be set to a value less than or equal to 24 hours (per contract rules).
        </p>
        <p>
        The compound count is the number of times the user has compounded. By default, the required compound count by the platform is 5, meaning the user will have to compound 5 times(compound once every 12 hours) before they can withdraw without the feedback tax of 60%. This feature in essense will ensure the longevity and stability of the project.
        </p>
        <p>
        To reward users who compound, 
        there is a bonus when you re-hire your daily crops earnings instead of selling them. 
        The bonus increases 2.5% every 12 hours that you compound without withdrawing (25% max after 5 days). 
        This incentivizes the user to compound more often, which will help boost the farms efficiency rate in the long run. 
        To be able to utilize the re-hire bonus feature, the player must not compound before the provided timer reaches 00:00:00.
        </p>
        <p>
        For the players who choose to not play the game and only sell, 
        there will be a 60% tax on those sells that will stay in the contract. 
        If the player makes two or more consecutive sells, this tax will be applied. 
        The only way for the user to not pay the 60% tax is to compound 5 times before making another withdrawal.
        </p>
      </div>
  },
  {
    title: `How does this platform work?`,
    content: <div
    id="faq-list-3"
    class="collapse show"
    data-bs-parent=".faq-list">
    <p>
            This platform work similarly to a financial market, where an asset has intrinsic value that is relative to the supply or demand of said asset. 
      Farmers are purchased with a pre-determined currency at a price relative to the Farmers's current mining efficiency rate. 
      After the Farmers are purchased, they go to work for you right away to give you the best yield on your investment possible, 
      for as long as possible. Just as any other asset bought and sold on an open market, the price of a Farmers will fluctuate over time, 
      as will the mining efficiency rate, as you and other players recruit Farmers, compound earnings and sell earnings. 
      To put it plainly, the more demand for the Farmers, the more they will increase in value and the more yield they will produce. 
      Inversely, when the demand decreases, so will the value of the Farmers and their daily return on investment.
    </p>
    <p>
            The main difference between a this game and a traditional financial market is that a recruited Farmers cannot be sold, 
      only the value they provide can be sold. As the players of the game as a whole compound their earnings and make new deposits, 
      the game efficiency rate will stay relatively constant, but the moment players start to sell more than they are compounding, 
      the efficiency rate will begin to drop as to preserve the TVL and longevity of the game.
    </p>
  </div>
  },
  {
    title: `What is the recommended strategy?`,
    content: <div
        id="faq-list-4"
        class="collapse show"
        data-bs-parent=".faq-list">
        <p>
          The best strategy that the team can recommend is to re-hire/compound for 6 days and harvest 1 day a week. 
          This will increase the users investment at the same time increasing the daily yield earnings. This strategy has already been tried and tested by several project and is proven effective both for the short and long term.
        </p>
      </div>
  }
]


const Wrapper = styled("div")(({ theme }) => ({
  // maxWidth: 800,
  // maxWidth: "80%",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

export default function Home() {
  const { address } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [busd, setBUSD] = useState(0.01);

  const handleBUSD = (e) => {
    setBUSD(e.target.value);
  }

  return (
    <div>
      <div id="header" class="fixed-top ">
        <div class="container d-flex align-items-center justify-content-lg-between">
          <div class="logo me-auto me-lg-0">
              <img style={{height: "100%", width: "40px", paddingRight: "5px",  fontFamily: "cursive"}} src="./assets/img/cropslogo.png" alt=""/>
              <div>
                <span class="busd">BNB KINGDOM</span>
              </div>
          </div>
          <nav id="navbar" class="navbar order-last order-lg-0">
            <ul>
              <li>
                <a class="nav-link" href="https://bscscan.com/address/0x8be8881C641Dc5A40845253Ee3eD04955eDFe96D#code" target="_blank"><img class="nav-logo" id="logo" alt="" src="./assets/img/bscscan-logo-light-circle.svg"></img><strong>Contract</strong></a>
              </li>
              <li>
                <a class="nav-link" href="https://twitter.com/BUSDCropFarmer" target="_blank"><img class="nav-logo" id="twitter" alt="" src="./assets/img/twitter.svg"></img><strong>Twitter</strong></a>
              </li> 
              <li>
                <a class="nav-link" href="https://t.me/busdcropfarmer" target="_blank"><img class="nav-logo" id="telegram" alt="" src="./assets/img/telegram.svg"></img><strong>Telegram</strong></a>
              </li>
              <li>
                <a class="nav-link" >
                  <button id="enableMetamask" class="btn connect-btn" onClick={connect}>Connect</button>
                </a>
              </li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle" onClick={() => {setOpen(!open); console.log("open => ", open); }}></i>
          </nav>
          {open && (
            <nav id="navbar" class="navbar order-last order-lg-0 navbar-mobile">
              <ul>
                <li>
                  <a class="nav-link" href="https://bscscan.com/address/0x8be8881C641Dc5A40845253Ee3eD04955eDFe96D#code" target="_blank"><img class="nav-logo" id="logo" alt="" src="./assets/img/bscscan-logo-light-circle.svg"></img><strong>Contract</strong></a>
                </li>
                <li>
                  <a class="nav-link" href="https://twitter.com/BUSDCropFarmer" target="_blank"><img class="nav-logo" id="twitter" alt="" src="./assets/img/twitter.svg"></img><strong>Twitter</strong></a>
                </li> 
                <li>
                  <a class="nav-link" href="https://t.me/busdcropfarmer" target="_blank"><img class="nav-logo" id="telegram" alt="" src="./assets/img/telegram.svg"></img><strong>Telegram</strong></a>
                </li>
                <li>
                  <a class="nav-link" >
                    <button id="enableMetamask" class="btn connect-btn" onClick={connect}>Connect</button>
                  </a>
                </li>
              </ul>
              <i class="bi bi-x mobile-nav-toggle" onClick={() => {setOpen(!open); console.log("open => ", open); }}></i>
            </nav>
          )}
          
        </div>
      </div>

      <div id="banner">
        <div id="wrapper">
          <div id="container">
          {/* <a href="https://bit.ly/3ME8Y1D" target="_blank"> */}
            <img class="banner-img" src="./assets/img/BNBHeader.PNG" alt="N.A.L.A. Apparel"/>
          {/* </a> */}
          </div>
        </div>
      </div>
      
      <div id="hero" class="bg d-flex align-items-center justify-content-center">
        <div class="wrapper">
          <div class="border"></div>
            <div class="main-element">
              <div class="container">
                <div class="content-box" data-aos="zoom-in">
                  <div class="row" style={{color:"white"}}>
                    <div class="col-lg-6">
                      {/* <h1><span class="busd">BUSD - Crops Farmer</span>!</h1> */}
                      <h3 style={{fontWeight: "bold", fontFamily:"cursive", color:"white", marginTop:"20px"}}>
                      <i class="bi-cloud-sun"></i>
                        <span class="busd">Hire, Grow, Harvest!</span>
                        </h3>	  
                    <h4>	
                      <i class="bi-check2-square bnb-icon"></i>
                      <span id="daily-rate"> 8% Daily ~ 2920% APR</span>
                    </h4>
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span id="ref-bonus"> 8% Referral Bonus</span>
                    </h4>
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span> 5% Development/Marketing Fee</span>
                    </h4>		  
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span id="daily-compound"> 2.5% Hire Bonus</span>
                    </h4>
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span><span id="compound-hours"> 12</span> Hours Compound Timer</span>
                    </h4>
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span><span id="withdraw-cooldown"> 4</span> Hours Withdraw Cooldown</span>
                    </h4>
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span><span id="cut-off-step"> 48</span> Hours Rewards Accumulation Cut-Off</span>
                    </h4>		  
                    <h4>
                      <i class="bi-check2-square bnb-icon"></i>
                      <span><span id="no-tax-compound-count"> 5</span> Times Mandatory Compound Feature</span>
                    </h4>    
                  </div>
                  <div class="col-lg-6">
                    <div class="stats-row-container">
                      <div class="stat">
                        <div class="header">
                          Total<span class="busd">BNB</span>Locked
                        </div>
                        <strong class="number" id="contract-balance">-</strong>
                      </div>
                      <div class="stat">
                        <div class="header">
                          Total<span class="busd">Deposit</span>Count
                        </div>
                        <strong class="number" id="total-players">-</strong>
                      </div>
                    </div>
                  </div>
                </div>
              <div class="row justify-content-center mt-2">
                <div class="col-xl-12 disclaimer">
                    <strong style={{color:"orange"}}>Important Note!</strong> 
              <p>
              To ensure sustainability and longevity of the project, 
              AND as an enhancement from the previous similar miner game, the crops farmers team has implemented a 
              feature that would encourage/enforce farmers to continuously compound before taking profit. 
              </p>
              <p>
              Users should compound X no. of times before they can withdraw.
              Should a farmer decide not to compound or hire more farmers using his earnings, and continuously withdraw, 
              farmer will be charged with a 60% feedback tax that will remain part of the contract. 
              </p>
              In Addition, to further encourage the community to re-hire/compound, there will be an additional 2.5% bonus for each compound action that the user will do, 
                which can stack up to 25% for 10 consecutive times / 5 days. By doing so, this will ensure the long term potential profit of every investor.
              <p>
              The best strategy that the team can recommend is to re-hire/compound for 6 days and harvest 1 day a week. 
              This will increase the users investment at the same time increasing the daily yield earnings. This strategy has already been tried and tested by several project and is proven effective.
              </p>
              {/* </i> */}
              <strong style={{color:"red"}}>High Risk! </strong> 
              Funds that are used to initially hire farmers (including re-hire) cannot be withdrawn, 
              however your farmers will indefinitely work and grow crops for you. Please use the application at your own risk. 
                  {/* </span> */}
                </div>
              </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div id="main">
        <div id="mine" class="bg d-flex">
          <div class="container main" data-aos="fade-up">
            <div class="content-box">
              <h4 style={{color:"#fff", fontWeight:"bold", fontFamily:"cursive", justifyContent:"center", letterSpacing:"2px", fontSize:"2rem", textAlign:"center"}} ><div class="busd">Farmer Dashboard</div></h4>
              <div class="row stats-row-container">
                <div class="col-lg-2 stat">
                  <div class="header">
                    <i class="bi-bank"></i>
                    <span> Initial Deposit</span>
                  </div>
                  <strong id="initial-deposit" class="number">-</strong>
                  <div>
                    <strong class="busd">BNB</strong>
                  </div>
                </div>
                <div class="col-lg-2 stat">
                  <div class="header">
                    <i class="bi-bank"></i>
                     <span> Total Deposit</span>
                  </div>
                  <strong id="total-deposit" class="number">-</strong>
                  <div>
                    <strong class="busd">BNB</strong>
                  </div>
                </div>
                <div class="col-lg-2 stat">
                  <div class="header">
                    <i class="bi-wallet2"></i>
                     <span> Sold Crops</span>
                  </div>
                  <div>
                    <strong id="total-withdrawn" class="number">-</strong>
                  </div>
                  <div>
                    <strong class="busd">BNB</strong>
                  </div>
                </div>
                <div class="col-lg-2 stat">
                  <div class="header">
                    <i class="bi-people"></i>
                     <span> Referral Rewards </span>
                     (<span id="ref-count"> - </span>)
                  </div>
                  <div>
                    <strong id="ref-rewards-busd" class="number">-</strong>
                  </div>
                  <div>
                    <strong class="busd">BNB</strong>
                  </div>
                </div>
              </div>
              <div class="row mt-5" style={{justifyContent:"space-evenly"}}>
                <div class="col-xl-5 first-box" style={{marginBottom:"20px"}}>
                  <div class="mine-card">
                    <div class="row example">
                      <div class="col-lg-8">
                        <div style={{lineHeight:"1.8"}}>
                          <strong>
                            Hiring Example
                          </strong>
                          <div>
                            <div>1<span class="busd">BNB</span> = <span id="example-miners"> 0 </span> Farmers</div>
                            <div>
                              <i class="ri-coins-line ri-1x"></i>
                              <span> Daily: </span>
                              <span id="example-busd">0</span><span class="busd">BNB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-4">
                        <div class="wallet">
                          <i class="bi-wallet2"></i>
                          <strong> Wallet</strong>
                          <div>
                            <span id="user-balance">0</span>
                            <span class="busd">BNB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="timer">
                      <i class="bi-hourglass-split"></i>
                      <span> Cart will be full in: </span>
                      <span id="claim-timer">--:--:--</span>
                    </div>
                    <div class="timer" style={{padding:"14px"}}>
                      <i class="bi bi-clock"></i>
                      <span> Time until next hire bonus is activated: </span>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <span style={{fontWeight:"700"}}id="compound-timer"> --:--:--</span>
                    </div>
                    <div class="btn-container">
                      {/* <div class="approve-container">
                        <div style={{paddingLeft:"5px", fontWeight:"700"}}>
                          <span style={{fontSize:"16px"}}>1.</span>
                          <strong>Approve</strong><span class="busd"> BUSD </span><span class="usd">(<span id="user-approved-spend">0</span> BUSD approved)</span>
                        </div>
                        <div>
                          <input class="form-control" id="approve-spend" name="approved-spend" step="1" type="number" value="1000"/>
                          <button class="btn glow-on-hover" id="" onClick={() => approveMiner()} style={{marginTop:"5px"}}>Approve BUSD</button>
                        </div>
                      </div> */}
                      <strong>
                        <i class="bi-bank"></i>
                        <span> Deposit</span>
                        <span class="busd">BNB</span>
                        <span class="usd">
                        ( min<span class="busd" id="min-deposit"> 0 </span>, 
                        </span>	
                        <span class="usd">
                        max<span class="busd" id="max-deposit">0</span>)</span>
                        <input class="form-control" id="busd-spend" name="buy-miners" onChange={handleBUSD} step="1" type="number" value={busd}/>
                      </strong>
                      <button class="btn glow-on-hover" id="buy-eggs-btn" onClick={ hireFarmers } role="button" style={{marginTop:"5px"}}>
                        <span>Hire </span>
                        <span id="eggs-to-buy">0</span>
                        <span> Farmers</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-xl-5" style={{marginBottom:"20px"}}>
                  <div class="mine-card">
                    <div class="miners-info" style={{marginBottom:"unset"}}>
                      <div>
                        <i class="bi-minecart"></i>
                        <span id="your-miners"> - </span>
                        Farmers
                      </div>
                      <div>
                        <i class="bi-arrow-down-short" style={{fontSize:"23px"}}></i>
                      </div>
                      <div style={{fontSize:"21px"}}>
                        <i class="ri-coins-line ri-1x"></i>
                        <strong id="mined"> -</strong>
                        <span><strong class="busd"> CROPS</strong></span>
                      </div>
                      <div class="usd" style={{fontSize:"14px", padding:"15px 0 25px 0"}}>
                        <strong>Estimated daily yield</strong>
                        <div>
                          <span id="eggs-per-day">0</span><strong class="busd">BNB</strong>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="timer">
                        <i class="bi-arrow-repeat"></i>
                        <span> Compound Count: </span>
                        <span id="compound-count"> 0</span>
                      </div>			
                      <div class="btn-container" style={{marginTop:"35px"}}>
                        <div style={{marginBottom:"20px"}}>
                          <button class="btn glow-on-hover" id="withdraw" onClick={ sellCrops } role="button">
                            Harvest Crops
                            <span class="cooldown" id="cooldown-timer">in --:--:--</span>
                            <span class="tax" id="withdraw-tax">-60% tax</span>
                          </button>
                        </div>

                        <div>
                          <button class="btn glow-on-hover" id="reinvest" onClick={ hireMoreFarmers } role="button">
                            Hire More Farmers
                            <span class="compound">
                              (<span class="compound" id="compound-bonus">+0% bonus</span>)
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 sub-section">
              Every time you hire or re-hire Farmers after the time interval, the compound counter will increase and your hire bonus grows by
              <span id="compound-percent">-%</span>
              (max <span id="max-compound">+-%</span>). Harvesting crops will reset your bonus to 0.
              {/* Time until next hire bonus is activated: <span style="font-weight: 700;" id="compound-timer">--:--:--</span> */}
            </div>
            <div class="row">
              <div class="col-lg-12 referral-link">
                <i class="bi-check2-square"></i>
                Earn
                <span id="ref-percent">-%</span>
                <span>when someone uses your referral link!</span>
                <span>
                  <a id="reflink"></a>
                  <span onClick={copyRef}>
                    <i class="ri-file-copy-line"></i>
                    <span id="copied"></span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id="faq" class="bg faq section-bg">
          <div class="container" data-aos="fade-up">
            <h4 style={{color:"#fff", justifyContent:"center", fontFamily:"cursive", marginTop:"20px", textAlign:"center"}}><div class="busd">Frequently Asked Questions</div></h4>
            <div class="faq-list">
              <ul>
                <Accordion>
                  {faqData.map((item, index) => {
                      return (
                          // <Reveal key={index} className='onStep' keyframes={fadeInUp} delay={100 * index} duration={800}>
                          <li>
                            <div className='accordion-box'>
                              <Accordion.Item eventKey={{ index }} style={{background:"transparent", border:"none"}}>
                                <Accordion.Header>
                                  <HelpOutlineIcon/>
                                  &nbsp;&nbsp;
                                  {/* <a
                                    data-bs-toggle="collapse"
                                    class="collapse"
                                    data-bs-target="#faq-list-4"
                                    > */}
                                    {item.title}
                                  {/* </a> */}
                                </Accordion.Header>
                                <Accordion.Body className="p-3">
                                    {item.content}
                                </Accordion.Body>
                              </Accordion.Item>
                            </div>
                          </li>
                          // </Reveal>
                      )
                  }
                  )}
                </Accordion>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer id="footer">
        <div class="container">
          <div class="copyright">
            © Copyright <strong><span>The BNB Kingdom Team</span></strong>. All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
