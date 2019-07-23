const chalk = require('chalk');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');

const prompt = inquirer.createPromptModule();
prompt.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

function main() {
  const choices = ['amy', 'bob', 'cindy', 'dick', 'emma', 'frank'];

  prompt([
    {
      type: 'checkbox-plus',
      name: 'routes',
      prefix: '✨',
      message: (...args) => {
        console.log(
          chalk.white.bgRed('NOTICE:') + 
          chalk.yellow(' If you select no routes, ALL OF THEM will be compiled.')
        );
        console.log(chalk.gray('Use <Space> to select, <↑/↓> to move, <Enter> to confirm.'));
        return 'Select routes you want to compile';
      },
      suffix: ': (input to search the route)',
      pageSize: 20,
      highlight: true,
      searchable: true,
      source: (answersSoFar, input) => {
        const search = input || '';
        return new Promise(resolve => {
          const fuzzyResult = fuzzy.filter(input, choices);
          const data = fuzzyResult.map(function(element) {
            return element.original;
          });

          resolve(data);
        });
      }
    }
  ]).then(({ routes }) => {
    const routesToIgnore = choices.filter(v => !routes.includes(v));
    const spawn = require('child_process').spawn;
    spawn('yarn', ['run', 'build', `--ignoreRoutes=${routesToIgnore.join(',')}`], {
      stdio: 'inherit'
    });
  });
}

main();
