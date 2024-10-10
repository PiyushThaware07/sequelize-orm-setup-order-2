const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');
const cliProgress = require('cli-progress');

const models = {};

// Helper function to load models recursively
function loadModelsFromDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively load models from subdirectories
            loadModelsFromDirectory(fullPath);
        } else if (file.endsWith('.model.js')) {
            // Ensure it's a model file and require it
            const modelDef = require(fullPath);
            if (typeof modelDef === 'function') {
                const model = modelDef(sequelize, Sequelize.DataTypes);
                models[model.name.charAt(0).toUpperCase() + model.name.slice(1)] = model;
            } else {
                console.error(`Failed to load model from ${file}: not a valid model definition`);
            }
        }
    });
}

// Load models from the models directory
loadModelsFromDirectory(__dirname);

// Sync models individually with progress bar
async function syncModels() {
    console.log("=======> Syncing models <=======");

    const totalModel = Object.keys(models).length;
    let modelCount = 0;

    // Create a new progress bar instance
    const progressBar = new cliProgress.SingleBar({
        format: 'Syncing Models | {bar} | {percentage}% | {value}/{total} models synced | Current Model: {modelName}',
        hideCursor: true
    }, cliProgress.Presets.shades_classic);

    // Start the progress bar
    progressBar.start(totalModel, 0, { modelName: '' });

    for (const modelName in models) {
        try {
            await models[modelName].sync({ alter: true }); // or { force: true } as needed
            modelCount++;
            progressBar.update(modelCount, { modelName: modelName });
        } catch (error) {
            console.error(`Error syncing table for model ${modelName}:`, error);
        }
    }

    // Stop the progress bar once done
    progressBar.stop();
}

// Create associations after syncing the models
async function createAssociations() {
    console.log("=======> Creating associations <=======");
    for (const modelName of Object.keys(models)) {
        if (models[modelName].associate) {
            try {
                models[modelName].associate(models);
                console.log(`Successfully created associations for model: ${modelName}`);
            }
            catch (error) {
                console.error(`Error creating associations for model ${modelName}:`, error);
            }
        }
    }
    // Optional: Sync again if needed after associations are created
    try {
        await sequelize.sync({ alter: true });
        console.log("=======> Associations synced <=======");
    } catch (error) {
        console.error('Error syncing after creating associations:', error);
    }
}

// Main function to sync models and create associations
async function initModels() {
    await syncModels();
    await createAssociations();
}

// Export the initModels function
module.exports = { initModels, models };
