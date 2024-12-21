const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = require("./routes")
const cors = require("cors");

const app = express();
app.use(cors({

})) // aceptar peticiones de cualquier origen
app.use(express.json());// para poder recibir datos en formato json
app.use(router)

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});