#!/usr/bin/env node
import { program } from 'commander';
import gradient from 'gradient-string';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkPath, getTemplateList } from './utils.js';

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);
const packageJsonPath = join(currentDirPath, '../package.json');

let json = fs.readFileSync(packageJsonPath);
let pkg = JSON.parse(json);

program.version(pkg.version);
program.command('init').description('创建一个新的模板').action(() => {
    console.log('\n');
    console.log(gradient.cristal('欢迎使用🌸-CLI工具，开始创建您的新项目\n'));

    inquirer.prompt([
        {
            type: 'input',
            name: 'proname',
            message: chalk.blue('请输入项目名称'),
            transformer: (input, answers, flags) => {
                const isAnswered = (flags.isFinal) ? chalk.green(`-- `) : '';
                return isAnswered + input;
            }
        },
        {
            type: 'list',
            name: 'templateName',
            default: 'pure',
            message: chalk.red('请输入需要创建的框架名称'),
            transformer: (input, answers, flags) => {
                const isAnswered = (flags.isFinal) ? chalk.green(`-- `) : '';
                return isAnswered + input;
            },
            choices: [
                {
                    name: chalk.greenBright('-- NestJS 后端框架'),
                    value: 'nest'
                },
                {
                    name: chalk.greenBright('-- vitesse  vue3模板'),
                    value: 'vitesse'
                }
            ],
        }
    ]).then(res => {
        if (!res.proname) {
            console.log(chalk.red('请输入项目名称'));
            return;
        }
        if (checkPath(res.proname)) {
            console.log(chalk.red('项目名称重复了~~'));
            return;
        }
        if (res.templateName) {
            getTemplateList(res.templateName, res.proname);
        } else {
            console.log(chalk.red('请选择模板名称!!'));
        }
    }).catch(error => {
        console.error('Error:', error.message);
    });
});

program.parse(process.argv);
