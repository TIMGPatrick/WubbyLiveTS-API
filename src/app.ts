import express, { Application } from "express";
import {auth} from 'express-openid-connect';
const app: Application = express();

require('dotenv').config();
require("./routes/routes")(app);
const port = process.env.PORT || 21035;

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
