#!/usr/bin/env node

const chalk = require("chalk");
const { program } = require("commander");
const ora = require("ora");

const getDefaultParams = require("./getDefaultParams");
const promptParams = require("./promptParams");
const createLib = require("./createLib");

async function init() {
  console.log(__dirname);
  const spinner = ora("Loading git config...").start();

  const defaultParams = await getDefaultParams();

  spinner.succeed("Loaded git config");

  const params = await promptParams(defaultParams);
  await createLib(params);
}

init();
