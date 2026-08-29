#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

const electronPath = require('electron');
const appPath = path.join(__dirname, '..');

const proc = spawn(electronPath, [appPath], {
  cwd: appPath,
  stdio: 'inherit',
  windowsHide: false
});

proc.on('close', (code) => {
  process.exit(code);
});
