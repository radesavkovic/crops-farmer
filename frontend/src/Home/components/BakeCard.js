/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import treasuryImg from "../../assets/treasury.png"
import profitImg from "../../assets/profit.png"

import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";

const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
  marginBottom: 24,
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BakeCard() {
  const { contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    // rewards: 0,
  });
  const [participants, setParticipants] = useState(0);
  const [fisherhiredtimes, setFisherhiredtimes] = useState(0);
  const [bakeBNB, setBakeBNB] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  const fetchContractBNBBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      return;
    }
    getBnbBalance(config.contractAddress).then((amount) => {
      setContractBNB(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        // rewards: 0,
      });
      return;
    }

    try {
      const [bnbAmount, beansAmount, /*rewardsAmount*/] = await Promise.all([
        getBnbBalance(address),
        contract.methods
          .getUserStashingPower(address)
          .call()
          .catch((err) => {
            console.error("myminers", err);
            return 0;
          }),
        /*contract.methods
          .beanRewards(address)
          .call()
          .catch((err) => {
            console.error("beanrewards", err);
            return 0;
          }),*/
      ]);
      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: beansAmount,
        // rewards: fromWei(`${rewardsAmount}`),
      });
    } catch (err) {
      console.error(err);
      setWalletBalance({
        bnb: 0,
        beans: 0,
        // rewards: 0,
      });
    }
  };

  const getProjectStats = async () => {
    try {
      const [_contractBalance, _participants, _fisherhiredtimes] = await contract.methods.getProjectStats().call();
      setContractBNB(_contractBalance);
      setParticipants(_participants);
      setFisherhiredtimes(_fisherhiredtimes);
    } catch (error) {
      console.log("error");
    }
  }

  useEffect(() => {
    fetchContractBNBBalance();
    getProjectStats();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0x0000000000000000000000000000000000000000";
    return ref;
  };

  const bake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.hireStashers(ref).send({
        from: address,
        value: toWei(`${bakeBNB}`),
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    getProjectStats();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.rehireStashers(ref).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.sellStash  ().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    getProjectStats();
    setLoading(false);
  };

  
  return (
    <div>
      <div className="auxContent">
        <div className="box leftBox contractInfoCard" >
          <div style={{display: "flex"}}>
            <img src={treasuryImg}></img>
            <div>
              <h5>Contract balance</h5>
              <h6>{contractBNB} BNB</h6>
            </div>
          </div>
          <Box paddingTop={1}>
              <div className="dataRow">
                <div className="name">Participants</div>
                <div className="value">{participants}</div>
              </div>
              <div className="dataRow">
                <div className="name">Stashers hired</div>
                <div className="value">{fisherhiredtimes}</div>
              </div>
          </Box>
        </div>
        <div className="box leftBox profitInfoCard">
          <div style={{display: "flex"}}>
            <img src={profitImg}></img>
            <div>
              <h5>Daily ROI</h5>
              <h6>12 %</h6>
            </div>
          </div>
          <Box paddingTop={1}>
            <div className="dataRow">
              <div className="name">APR</div>
              <div className="value">4380 %</div>
            </div>
            <div className="dataRow">
              <div className="name">Devtax</div>
              <div className="value">4 %</div>
            </div>
          </Box>
        </div>
      </div>
      <div className="mainContent">
        <div className="box leftBox">
          {loading && <LinearProgress color="secondary" />}
          <Typography variant="h5" style={{color:"white", fontFamily:"sans-serif", fontSize:"25px"}}>
            <b>Hire Stashers</b>
          </Typography>
          <div>
            {/* <div className="dataRow">
              <div className="name">Contract</div>
              <div className="value">{contractBNB} BNB</div>
            </div> */}
            <div style={{color:"blue", marginTop:"20px"}}>Your stats</div>
            <div className="dataRow">
              <div className="name">Wallet</div>
              <div className="value">{walletBalance.bnb} BNB</div>
            </div>
            <div className="dataRow">
              <div className="name">Your Stashers</div>
              <div className="value">{walletBalance.beans} </div>
            </div>

            <Box >
              <Box>
                <PriceInput
                  max={+walletBalance.bnb}
                  value={bakeBNB}
                  onChange={(value) => onUpdateBakeBNB(value)}
                />
              </Box>
              <Box marginTop={2} marginBottom={0}>
                <Button
                  className="button1"
                  color="secondary"
                  variant="contained"
                  fullWidth
                  disabled={wrongNetwork || !address || +bakeBNB === 0 || loading}
                  onClick={bake}
                >
                  <b>Hire</b>
                </Button>
              </Box>
              {/* <Divider /> */}
              {/* <div className="dataRow">
                <div className="name">Your Rewards</div>
                <div className="value">{walletBalance.rewards} BNB</div>
              </div> */}

              {/* <ButtonContainer container>
                <Grid item flexGrow={1} marginRight={1} marginTop={3}>
                  <Button
                    className="button1"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={wrongNetwork || !address || loading}
                    onClick={reBake}
                  >
                    <b>RE-STACK</b>
                  </Button>
                </Grid>
                <Grid item flexGrow={1} marginLeft={1} marginTop={3}>
                  <Button
                    className="button1"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={wrongNetwork || !address || loading}
                    onClick={eatBeans}
                  >
                    <b>EAT CHEESE</b>
                  </Button>
                </Grid>
              </ButtonContainer> */}
            </Box>
          </div>
        </div>
        <div className="box leftBox">
          <Typography variant="h5" style={{color:"white", fontFamily:"sans-serif", fontSize:"25px"}}>
            <b>Your Rewards</b>
          </Typography>
          <div>
            <div style={{color:"blue", marginTop:"20px"}}>Re-hire</div>
            <div className="dataRow">
              <div className="name">65% chance</div>
              <div className="value"> BNB</div>
            </div>
            <div className="dataRow">
              <div className="name">35% chance</div>
              <div className="value"> BNB</div>
            </div>
          </div>
          <div style={{marginTop:"20px"}}>
            <div style={{color:"blue", marginTop:"20px"}}>Sell</div>
            <div className="dataRow">
              <div className="name">100% chance</div>
              <div className="value"> BNB</div>
            </div>
          </div>
          <ButtonContainer container>
              <Grid item flexGrow={1} marginRight={1} marginTop={3}>
                <Button
                  className="button1"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={wrongNetwork || !address || loading}
                  onClick={reBake}
                >
                  <b>RE-HIRE</b>
                </Button>
              </Grid>
              <Grid item flexGrow={1} marginLeft={1} marginTop={3}>
                <Button
                  className="button1"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={wrongNetwork || !address || loading}
                  onClick={eatBeans}
                >
                  <b>SELL</b>
                </Button>
              </Grid>
          </ButtonContainer>
        </div>
      </div>
    </div>
  );
}
