// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'CLOUD_BUCKET',
    'DATA_BACKEND',
    'GCLOUD_PROJECT',
    'MEMCACHE_URL',
    'MONGO_URL',
    'MONGO_COLLECTION',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'NODE_ENV',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'OAUTH2_CALLBACK',
    'PORT',
    'SECRET'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    // Typically you will create a bucket with the same name as your project ID.
    CLOUD_BUCKET: 'oauth-186821',

    // dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
    // configure the appropriate settings for each storage engine below.
    // If you are unsure, use datastore as it requires no additional
    // configuration.
    DATA_BACKEND: 'mongodb',

    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: 'oauth-186821',

    // Connection url for the Memcache instance used to store session data
    MEMCACHE_URL: 'localhost:11211',

    // MongoDB connection string
    // https://docs.mongodb.org/manual/reference/connection-string/
    MONGO_URL: 'mongodb://localhost:27017',
    MONGO_COLLECTION: 'auth',

    MYSQL_USER: '',
    MYSQL_PASSWORD: '',

    OAUTH2_CLIENT_ID: '1059098531864-877e25bb4njnojsqm3vtq2agbsej4kuh.apps.googleusercontent.com',
    OAUTH2_CLIENT_SECRET: 'mN9AD_oEIjbuAYymOubvGtEO',
    OAUTH2_CALLBACK: 'http://localhost:3000/auth/google/callback',

    PORT: 3000,

    // Set this a secret string of your choosing
    SECRET: 'lost&found'
  });

// Check for required settings
checkConfig('GCLOUD_PROJECT');
checkConfig('CLOUD_BUCKET');
checkConfig('OAUTH2_CLIENT_ID');
checkConfig('OAUTH2_CLIENT_SECRET');

if (nconf.get('DATA_BACKEND') === 'cloudsql') {
  checkConfig('MYSQL_USER');
  checkConfig('MYSQL_PASSWORD');
  if (nconf.get('NODE_ENV') === 'production') {
    checkConfig('INSTANCE_CONNECTION_NAME');
  }
} else if (nconf.get('DATA_BACKEND') === 'mongodb') {
  checkConfig('MONGO_URL');
  checkConfig('MONGO_COLLECTION');
}

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}
