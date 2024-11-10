const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT_NO;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
