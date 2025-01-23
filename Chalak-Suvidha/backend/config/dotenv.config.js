
require('dotenv').config();

function validateEnvVariables() {
    const requiredEnvVars = [
        'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
        'VAHAN_API_URL', 'VAHAN_API_TOKEN',
        'SARATHI_API_URL', 'SARATHI_API_TOKEN',
        'FASTAG_API_URL', 'FASTAG_API_TOKEN',
        'ECHALLAN_API_URL', 'ECHALLAN_API_TOKEN',
        'EWAYBILL_API_URL', 'EWAYBILL_API_TOKEN',
        'GST_API_URL', 'GST_API_TOKEN', 'GST_USERNAME', 'GST_PASSWORD',
        'DIGILOCKER_API_URL', 'DIGILOCKER_API_TOKEN', 'DIGILOCKER_USERNAME', 'DIGILOCKER_PASSWORD'
    ];

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.error(`❌ Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    });

    console.log('✅ All required environment variables are present.');
}

function logEnvironment() {
    console.log('Environment Configuration:');
    console.log(`- DB_HOST: ${process.env.DB_HOST}`);
    console.log(`- DB_USER: ${process.env.DB_USER}`);
    console.log(`- DB_NAME: ${process.env.DB_NAME}`);
    console.log(`- ENVIRONMENT: ${process.env.ENVIRONMENT}`);
    console.log(`- VAHAN_API_URL: ${process.env.VAHAN_API_URL}`);
    console.log(`- SARATHI_API_URL: ${process.env.SARATHI_API_URL}`);
    console.log(`- FASTAG_API_URL: ${process.env.FASTAG_API_URL}`);
    console.log(`- ECHALLAN_API_URL: ${process.env.ECHALLAN_API_URL}`);
    console.log(`- EWAYBILL_API_URL: ${process.env.EWAYBILL_API_URL}`);
    console.log(`- GST_API_URL: ${process.env.GST_API_URL}`);
    console.log(`- DIGILOCKER_API_URL: ${process.env.DIGILOCKER_API_URL}`);
}

// Validate environment variables
validateEnvVariables();

// Log environment configuration
logEnvironment();
