import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

import Web3 from "web3";
import { useEffect, useState } from "react";

import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useLocation } from "react-router-dom";

const CardWrapper = styled(Card)({
  background: "rgb(255 252 248)",
  marginBottom: 24,
});

const rewardsInfo = [
  {
    label: "Daily Return",
    value: 10,
  },
  {
    label: "APR",
    value: "3,650",
  },
  {
    label: "Devtax",
    value: 4.5, 
  },
];

export default function RewardsInfo() {
  const { contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();

  const [loading, setLoading] = useState(false);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();







  return (
    <div>
        {/* {loading && <LinearProgress color="secondary" />}
        <Typography variant="h5" style={{color:"white", fontFamily:"mooncheese", fontSize:"25px"}}>
          <b>Your Rewards</b>
        </Typography>
        <div>
          <div style={{color:"grey", marginTop:"20px"}}>Re-hire</div>
          <div className="dataRow">
            <div className="name">65% chance</div>
            <div className="value"> BNB</div>
          </div>
          <div className="dataRow">
            <div className="name">35% chance</div>
            <div className="value"> Cheese</div>
          </div>
        </div>
        <div style={{marginTop:"20px"}}>
          <div style={{color:"grey", marginTop:"20px"}}>Sell</div>
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
    </div>
  );
}
