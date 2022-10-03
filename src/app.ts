import express, { Application, Response, Request } from "express";

const app: Application = express();

require('dotenv').config();
require("./routes/routes")(app);

const port = process.env.PORT || 21035;

app.use(express.json());

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
