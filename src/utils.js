import fs from "node:fs"
import download from "download-git-repo"
import ora from "ora"
import chalk from 'chalk';

const spinner = ora(chalk.blue('正在下载模板...'))

// 检查路径
export function checkPath(path) {
    if (fs.existsSync(path)) {
        return true
    } else {
        return false
    }
}
// 处理获取的模板 
export function getTemplateList(templateName, proname) {
    if (templateName === 'pure') {
        spinner.fail(chalk.red('下载失败,无对应模板'))

    }
    if (templateName === 'vben') {
        spinner.fail(chalk.red('下载失败,无对应模板'))
    }
    if (templateName === 'vitesse') {
        const url = `direct:https://gitee.com/gtty11234/vite-template.git`
        downloadTemplate(url, proname)
    }

}
// 处理对应的下载
export function downloadTemplate(url, proname) {
    spinner.start()
    return new Promise((resolve, reject) => {
        download(url, proname, { clone: true }, (err) => {
            if (err) {
                spinner.fail(chalk.red('下载失败'))
                reject(err)
            } else {
                resolve()
                spinner.succeed(chalk.blue('下载成功'))
                console.log(chalk.yellowBright('-- cd ' + proname))
                console.log(chalk.yellowBright('-- pnpm i  安装依赖'))
            }
        })
    })
}



