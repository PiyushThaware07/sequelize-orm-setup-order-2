const sequelize = require("./db.config");
const yesno = require("yesno");
const { initModels } = require("../models/index");

const connectDatabase = async () => {
    try {
        console.log("--> Connecting to database...");
        await sequelize.authenticate();
        const environment = process.env.NODE_ENV === "production" ? "Production 🚀" : "Development ⚙️";
        console.log(`--> Database connected successfully : ${environment}`);

        // Create a promise for the yesno prompt
        const syncPrompt = yesno({
            question: "Do you want to create tables and sync models? (yes/no): ",
        });

        // Start the timeout promise
        const timeoutPromise = new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                console.log("\nNo response received in 10 seconds. Defaulting to 'no'.");
                resolve(false);
            }, 10000);

            syncPrompt.then((answer) => {
                clearTimeout(timeoutId); // Clear the timeout if the user responds
                resolve(answer); // Resolve with the user's answer
            }).catch((error) => {
                console.error("Error during prompt:", error);
                resolve(false); // Default to 'no' on error
            });
        });

        // Await the result of either the prompt or the timeout
        const shouldSync = await timeoutPromise;

        if (shouldSync) {
            await initModels();
            console.log("--> Models synced successfully.");
        } else {
            console.log("--> Skipped syncing models.");
        }
    } catch (error) {
        console.error("--> Database connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDatabase;
