const inquirer = require("inquirer");
const validateNpmPackageName = require("validate-npm-package-name");
const validateNpmLicense = require("validate-npm-package-license");

async function promptParams(defaultParams) {
  let answers;
  try {
    answers = await inquirer.prompt([
      {
        type: "input",
        name: "packageName",
        message: "✏️  Package name",
        validate: (input) => {
          return input && validateNpmPackageName(input).validForNewPackages;
        },
      },
      {
        type: "input",
        name: "author",
        message: "🎅 Package author",
        default: defaultParams.author,
      },
      {
        type: "input",
        name: "license",
        message: "📄 License",
        default: defaultParams.license,
        validate: (input) => {
          return input && validateNpmLicense(input).validForNewPackages;
        },
      },
    ]);
  } catch (e) {
    console.log(e);
  }

  return answers;
}

module.exports = promptParams;
