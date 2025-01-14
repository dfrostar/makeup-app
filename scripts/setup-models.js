const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');

const MODELS_DIR = path.join(__dirname, '..', 'models');

// Base URL for the models
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const MODELS = [
    {
        name: 'face_landmark_68_model-shard1',
        url: `${BASE_URL}/face_landmark_68_model-shard1`
    },
    {
        name: 'face_landmark_68_model-weights_manifest.json',
        url: `${BASE_URL}/face_landmark_68_model-weights_manifest.json`
    },
    {
        name: 'face_recognition_model-shard1',
        url: `${BASE_URL}/face_recognition_model-shard1`
    },
    {
        name: 'face_recognition_model-shard2',
        url: `${BASE_URL}/face_recognition_model-shard2`
    },
    {
        name: 'face_recognition_model-weights_manifest.json',
        url: `${BASE_URL}/face_recognition_model-weights_manifest.json`
    },
    {
        name: 'tiny_face_detector_model-shard1',
        url: `${BASE_URL}/tiny_face_detector_model-shard1`
    },
    {
        name: 'tiny_face_detector_model-weights_manifest.json',
        url: `${BASE_URL}/tiny_face_detector_model-weights_manifest.json`
    }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${path.basename(dest)}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(dest, () => {});
            reject(err);
        });

        file.on('error', err => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function setupModels() {
    try {
        // Create models directory if it doesn't exist
        if (!fs.existsSync(MODELS_DIR)) {
            await fs.promises.mkdir(MODELS_DIR, { recursive: true });
        }

        console.log('Downloading face-api.js models...');
        
        // Download each model
        for (const model of MODELS) {
            const modelPath = path.join(MODELS_DIR, model.name);
            if (!fs.existsSync(modelPath)) {
                await downloadFile(model.url, modelPath);
            } else {
                console.log(`Model already exists: ${model.name}`);
            }
        }

        console.log('All models downloaded successfully!');
    } catch (error) {
        console.error('Error setting up models:', error);
        process.exit(1);
    }
}

// Run the setup
setupModels();
