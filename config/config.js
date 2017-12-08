'use strict';

//Esporta configurazione ricavata dal file json di configurazione
const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  //config file
  .file({ file: path.join(__dirname, 'config.json') });

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}
