import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
});

const Input = styled("input")(({ theme }) => ({
  fontSize: 14,
  fontWeight: 300,
  padding: "5px 20px",
  marginRight: "10px",
  borderRadius: "5px",
  border: "2px solid #0cbbfa",
  backgroundColor: "transparent",
  width: "100%",
  outline: "none",
  // color: theme.palette.primary.main,
  color: "yellow",
  maxWidth:"85%"
}));

const copyfunc = async (text) => {
    try {
      const toCopy = text;
      await navigator.clipboard.writeText(toCopy);
      console.log('Text or Page URL copied');
    }
    catch (err) {
      console.error('Failed to copy: ', err);
    }
}

export default function ReferralLink({ address }) {
  const link = `${window.origin}?ref=${address}`;

  return (
    <div className="referral">
      <h1>Referral Link</h1>
      <p>Earn 13% of the BNB used to hire stashers from anyone who uses your referral link</p>
      <div class="refWrapper">
        <Input value={address ? link : ""} readOnly />
        <div 
          class="copyButton"
          onClick={e => copyfunc(address ? link : "")}
          >
            <b>COPY</b>
        </div>
      </div>

      {/* <Typography
        textAlign="center"
        variant="body2"
        marginTop={2}
        paddingX={3}
        color="#e58f0e"
      >
        Earn 12% of the BNB used to bake beans from anyone who uses your
        referral link
      </Typography> */}
    </div>
  );
}
