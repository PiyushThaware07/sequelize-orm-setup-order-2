const dotenv = require("dotenv");
dotenv.config();
const app = require("./config/express.config");
const connectDatabase = require("./config/db.connection");


async function main() {
    try {
        // connect database
        await connectDatabase();

        // start server
        const port = 8000;
        app.listen(port, () => {
            console.log(`--> Server Running at http://localhost:${port}`);
        })
    }
    catch (error) {
        console.error("--> Failed to start the server. Error :", error.message);
        process.exit(0);
    }
}
main();