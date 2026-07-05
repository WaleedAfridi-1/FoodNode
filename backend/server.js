require('dotenv').config();
const app = require("./src/app");
const ConnectDB = require("./src/db/db");


ConnectDB();

app.listen(5000, () => {
    console.log("Running on 5000 port")
})