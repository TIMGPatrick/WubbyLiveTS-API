const pinoLogger = require('pino');

const streams = [
    {stream: process.stdout},
    {stream: pinoLogger.destination(`${__dirname}/../../combined.log`)},
];


const logger = pinoLogger({
    level: process.env.PINO_LOG_LEVEL || 'info',
}, pinoLogger.multistream(streams, {dedupe: false}));

// Exports
export {logger}
