const {Pool} = require("pg")
const host = process.env.PG_HOST||'localhost';
const port = process.env.PG_PORT || 5432;
const user = process.env.PG_USER || 'postgres';
const password = process.env.PG_PASSWORD || 'abc123';
const database = process.env.PG_DATABASE || 'crawling-data';

const connectionString = 'postgresql://' + user + ':' + password + '@' + host + ':' + port + '/' + database

const pool = new Pool({
    connectionString
})

pool
.connect()
.then(async (client) =>{
    console.log("Connected to PostgreSQL database");
    try {
        try {
            const res = await client
                .query("SELECT NOW()");
                const currentTime = new Date(res.rows[0].now)
            console.log("Connected time: ", currentTime.toLocaleString("vi-VN"));
        } catch (err) {
            console.error("Query error: ", err);
        }
    } finally {
        client.release();
    }
})
.catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
})

module.exports = pool