import express, { Application, Response, Request } from "express";
import {logger} from "./tools/logger";
const cors = require('cors')
const pino = require('pino-http')


const app: Application = express();
require('dotenv').config();

require("./routes/routes")(app);
const port = process.env.PORT || 21035;

app.use(express.json());
app.use(cors())
// A http request logger
app.use(pino)

try {
    app.listen(port, (): void => {
        logger.info(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    logger.error(`Error occurred: ${error.message}`);
}
