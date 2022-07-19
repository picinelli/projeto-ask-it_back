import express from "express";
import "express-async-errors"
import cors from "cors";
import 'dotenv/config'
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(router)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor aberto na porta ${PORT}`)
})
