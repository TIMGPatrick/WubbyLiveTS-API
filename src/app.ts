import express, { Application, Response, Request } from "express";
import {logger} from "./tools/logger";
const pinoHTTP = require('pino-http')
const cors = require('cors')

const app: Application = express();
require('dotenv').config();

require("./routes/routes")(app);
const port = process.env.PORT || 21035;

app.use(express.json());
app.use(cors());
//might not need this level of logging every request, not sure it even works tbh
// app.use(pinoHTTP({
//     logger
// }))

try {
    app.listen(port, (): void => {
        logger.info(`Connected successfully on port ${port}`);
    });
} catch (error: any) {
    logger.error(`Error occurred: ${error.message}`);
}
