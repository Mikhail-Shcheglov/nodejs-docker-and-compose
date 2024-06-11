require('dotenv').config();

const {
  DEPLOY_PATH,
  DEPLOY_HOST,
  DEPLOY_REF,
  DEPLOY_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
} = process.env;

module.exports = {
  apps: [{
    name: "backend",
    script: "./dist/main.js",
    env_production: {
      NODE_ENV: 'production',
      POSTGRES_HOST,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
      POSTGRES_PORT,
    },
    env_development: {

    },
    env_testing: {

    },
  }],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/Mikhail-Shcheglov/nodejs-docker-and-compose.git',
      path: DEPLOY_PATH,
    },
  },
};
