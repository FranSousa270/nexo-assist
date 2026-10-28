
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "nexo-assist-api",
  });
});

app.listen(PORT, () => {
  console.log(`Nexo Assist API rodando em http://localhost:${PORT}`);
});
