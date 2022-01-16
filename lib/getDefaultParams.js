"use strict";

const getGitConfigPath = require("git-config-path");
const parseGitConfig = require("parse-git-config");
const getGithubUsername = require("github-username");

async function getDefaultParams() {
  const defaults = {
    author: "",
    description: "Made with ...",
    license: "MIT",
  };

  try {
    const gitConfigPath = getGitConfigPath("global");

    if (gitConfigPath) {
      const gitConfig = parseGitConfig.sync({ path: gitConfigPath });

      if (gitConfig.github && gitConfig.github.user) {
        defaults.author = gitConfig.github.user;
      } else if (gitConfig.user && gitConfig.user.email) {
        defaults.author = await getGithubUsername(gitConfig.user.email);
      }
    }
  } catch (e) {
    console.log("There was an error collecting git info.", e);
  }

  return defaults;
}

module.exports = getDefaultParams;
