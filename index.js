const app = require("./src/app")

const PORT = 8000

const server = app.listen(PORT, () =>{
    console.log(`Crawling Data Server is running on server ${PORT}`);
})

process.on("SIGINT",() => {
    server.close(() => {
        console.log('Exit Crawling Data Server Express');
        process.exit(0)
    })

})