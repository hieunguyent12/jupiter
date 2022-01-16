const fs = require("fs");
const chalk = require("chalk");
const globby = require("globby");
const path = require("path");
const ora = require("ora");
const execa = require("execa");
const handlebars = require("handlebars");

async function createLib(params) {
  const { packageName, author, license } = params;

  const currentDir = process.cwd();

  const packageDir = path.join(currentDir, packageName);

  const templateDir = path.join(__dirname, "..", "templates");

  // Find the file or directory that matches templateDir
  // passing "dot" option allows files like ".git" and ".eslint" to be matched
  const files = await globby(templateDir, {
    dot: true,
  });

  const fileCopySpinner = ora("Copying files...").start();

  files.forEach((file) => {
    copyFile(file, templateDir, packageDir, params);
  });

  fileCopySpinner.succeed("Copied files successfully");

  const commandsSpinnder = ora(
    "Installing packages and initializing git..."
  ).start();

  await runNpmInstall(packageDir);
  await runGitInit(packageDir);

  commandsSpinnder.succeed(
    "Installed packages and initialized git successfully"
  );
}

async function copyFile(templateFile, templateDir, packageDir, params) {
  const fileRelativePath = path.relative(templateDir, templateFile);

  const packageFilePath = path.join(packageDir, fileRelativePath);
  const packageDirPath = path.parse(packageFilePath).dir;

  // If the current template file is inside a directory, this will create the directory
  fs.mkdirSync(packageDirPath, {
    recursive: true,
  });

  // copy the content
  const content = fs.readFileSync(templateFile, "utf-8");

  const template = handlebars.compile(content);

  fs.writeFileSync(
    packageFilePath,
    template({
      ...params,
    })
  );
}

async function runNpmInstall(packageDir) {
  const command = {
    cmd: "npm",
    args: ["install"],
    cwd: packageDir,
  };

  await execa(command.cmd, command.args, {
    cwd: command.cwd,
  });
}

async function runGitInit(packageDir) {
  const command = {
    cmd: "git",
    args: ["init"],
    cwd: packageDir,
  };

  await execa(command.cmd, command.args, {
    cwd: command.cwd,
  });
}

module.exports = createLib;
