const sequelize = require("./db.config");
const yesno = require("yesno");
const { initModels } = require("../models/index");

let hasSynced = false;

const connectDatabase = async () => {
    try {
        console.log("--> Connecting to database...");
        await sequelize.authenticate();
        console.log("--> Database connected successfully.");

        if (!hasSynced) {
            // Create a timeout promise that resolves to 'no' after 10 seconds
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => {
                    console.log("\n--> No response received in 10 seconds. Defaulting to 'no'.");
                    resolve(false);
                }, 10000);
            });

            // Create a promise for the yesno prompt
            const syncPrompt = yesno({
                question: "Do you want to create tables and sync models? (yes/no): ",
            });

            // Await the result of either the prompt or the timeout
            const shouldSync = await Promise.race([timeoutPromise, syncPrompt]);

            if (shouldSync) {
                console.log("--> Syncing models...");
                await initModels();
                console.log("--> Models synced successfully.");
            } else {
                console.log("--> Skipped syncing models.");
            }

            hasSynced = true;
        }
    } catch (error) {
        console.error("--> Database connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDatabase;
