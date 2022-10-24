import {logger} from "../tools/logger";

const { Pool } = require('pg')

let credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};


const pool = new Pool(credentials)
module.exports = {
    async query(text: string, params: any[]): Promise<any> {
        const start = Date.now()
        const client = await pool.connect()
        const res = await client.query(text, params)
        const duration = Date.now() - start
        logger.info('executed query', { text, duration, rows: res.rowCount, row_data: res.rows })
        // logger.info(`row information ${res.rows[0].id}`)
        client.release();
        return res.rowCount == 1 ? res.rows[0] : res.rows;
        // return res
    },
    async getClient() {
        const client = await pool.connect(credentials)
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            logger.error('A client has been checked out for more than 5 seconds!')
            logger.error(`The last executed query on this client was: ${client.lastQuery}`)
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args:any) => {
            client.lastQuery = args
            return query.apply(client, args)
        }
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout)
            // set the methods back to their old un-monkey-patched version
            client.query = query
            client.release = release
            return release.apply(client)
        }
        return client
    }
}
