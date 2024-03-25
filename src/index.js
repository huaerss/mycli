#!/usr/bin/env node
import { program } from 'commander'
import gradient from 'gradient-string';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from "node:fs"
import inquirer from 'inquirer'
import ora from "ora"
const spinner = ora()
import { checkPath, getTemplateList } from './utils.js'
const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);
const packageJsonPath = join(currentDirPath, '../package.json');

let json = fs.readFileSync(packageJsonPath)
let pkg = JSON.parse(json)




program.version(pkg.version);
program.command('init').description('创建一个新的模板').action((project) => {
    console.log('\n')
    console.log(gradient.cristal('欢迎使用东莞联德尚 CLI工具，开始创建您的新项目\n'));

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
                    name: chalk.greenBright('-- pure-admin 精简版后台'),
                    value: 'pure'

                },
                {
                    name: chalk.greenBright('-- vben-admin 中大型项目'),
                    value: 'vben'
                },
                {
                    name: chalk.greenBright('-- vitesse  vue3模板'),
                    value: 'vitesse'
                }
            ],
        }
    ]).then(res => {
        if (!res.proname) {
            spinner.fail(chalk.red('请输入项目名称'))
            return
        }
        if (checkPath(res.proname)) {
            spinner.fail(chalk.red('项目已存在'))
            return
        }
        if (res.templateName) {
            getTemplateList(res.templateName, res.proname)
        } else {

            // 使用ora库，显示下载失败

            return
        }
    })

})
program.parse(process.argv)
