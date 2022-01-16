const fs = require("fs");
const chalk = require("chalk");
const globby = require("globby");
const path = require("path");
const ora = require("ora");
const execa = require("execa");

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
  // console.log(templateDir, files);

  // copyFile(files[0], templateDir, packageDir);

  const fileCopySpinner = ora("Copying files...").start();

  files.forEach((file) => {
    copyFile(file, templateDir, packageDir);
  });

  fileCopySpinner.succeed("Copied files successfully");

  await runNpmInstall(packageDir);
}

async function copyFile(templateFile, templateDir, packageDir) {
  // console.log(templateFile, templateDir);
  // console.log();
  const fileRelativePath = path.relative(templateDir, templateFile);

  const packageFilePath = path.join(packageDir, fileRelativePath);
  const packageDirPath = path.parse(packageFilePath).dir;

  // console.log(packageFilePath, packageDirPath);
  // If the current template file is inside a directory, this will create the directory
  fs.mkdirSync(packageDirPath, {
    recursive: true,
  });

  // copy the content
  const content = fs.readFileSync(templateFile, "utf-8");

  fs.writeFileSync(packageFilePath, content);
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

module.exports = createLib;
