#!/usr/bin/env node
/*******************************************************************************
 * cli router
 ******************************************************************************/

// Set the working directory so it's consistent
process.chdir(__dirname);

var program = require('commander');

var pkg = require(process.cwd() + '/package.json');

program
  .version(pkg.version)
  .command('run', 'Start the server', {isDefault: true})
  .command('init', 'Run the initialization scripts needed for the server to run')
  .parse(process.argv);
