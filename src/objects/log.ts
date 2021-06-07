import log4js from 'log4js';
const logconfig=require('./logconfig.json');
log4js.configure(logconfig);
const log = log4js.getLogger();

export default log;
