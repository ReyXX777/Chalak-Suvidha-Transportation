require('dotenv').config();

function getEnvVariable(key, defaultValue = null) {
    if (process.env[key] === undefined && defaultValue === null) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return process.env[key] || defaultValue;
}

module.exports = {
    DB_HOST: getEnvVariable('DB_HOST'),
    DB_USER: getEnvVariable('DB_USER'),
    DB_PASSWORD: getEnvVariable('DB_PASSWORD'),
    DB_NAME: getEnvVariable('DB_NAME'),
    ENVIRONMENT: getEnvVariable('ENVIRONMENT', 'development'),
    PORT: getEnvVariable('PORT', 3000), // Added PORT with a default value of 3000
    API_KEY: getEnvVariable('API_KEY'), // Added API_KEY as a required environment variable
    JWT_SECRET: getEnvVariable('JWT_SECRET', 'default_jwt_secret'), // Added JWT_SECRET with a default value
    LOG_LEVEL: getEnvVariable('LOG_LEVEL', 'info') // Added LOG_LEVEL with a default value of 'info'
};
