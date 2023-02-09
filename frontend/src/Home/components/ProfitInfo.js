import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import treasuryImg from "../../assets/treasury.png"
import profitImg from "../../assets/profit.png"
import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  background: "rgb(255 252 248)",
  marginBottom: 24,
});

const nutritionFacts = [
  {
    label: "Daily Return",
    value: 10,
  },
  {
    label: "APR",
    value: "3,650",
  },
  {
    label: "Dev Fee",
    value: 4.5, 
  },
];

export default function ProfitInfo() {
  return (
    <div >
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
  );
}
