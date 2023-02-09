import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const BnbInput = styled("input")({
  fontSize: 18,
  fontWeight: 500,
  padding: "8px 30px 8px 20px",
  textAlign: "center",
  color: "#feec6c",
  borderRadius: 5,
  border: "2px solid #0cbbfa",
  background: "#007e79",
  width: "100%",
  outline: "none",
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
    MozAppearance: "textfield",
  },
});

export default function PriceInput({ value, max, onChange = () => {} }) {
  return (
    <Box position="relative" style={{marginTop:"20px"}}>
      
      <Typography
        fontSize={18}
        position="absolute"
        top={9}
        right={18}
        fontWeight={500}
        color="#feec6c"
        fontFamily={"mooncheese"}
      >
        BNB amount
      </Typography>

      <BnbInput
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}
