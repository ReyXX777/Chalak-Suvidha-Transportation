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
};
