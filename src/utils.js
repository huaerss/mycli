import fs from 'fs';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

const spinner = ora(chalk.blue('正在下载模板...'));

// 检查路径
export function checkPath(projectPath) {
    return fs.existsSync(projectPath);
}

// 处理获取的模板
export function getTemplateList(templateName, proname) {
    let url = ''
    switch (templateName) {
        case 'vitesse':
            url = 'https://gitee.com/gtty11234/vite-template/repository/archive/master.zip';
            downloadTemplate(url, proname);
            break;
        case 'nest':
            url = 'https://gitee.com/gtty11234/nest-js/repository/archive/master.zip',
                downloadTemplate(url, proname);
            break
        default:
            console.log(chalk.red('无对应模板'));
            break;
    }
}

// 下载并保存 ZIP 文件，之后解压
export async function downloadTemplate(url, proname) {
    spinner.start();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`下载失败: ${response.statusText}`);
        }

        const buffer = await response.buffer();
        const zipFilePath = path.join(process.cwd(), `${proname}.zip`);

        fs.writeFileSync(zipFilePath, buffer);
        spinner.succeed(chalk.blue('下载成功，正在解压...'));

        const zip = new AdmZip(zipFilePath);
        const tempDir = path.join(process.cwd(), `${proname}_temp`);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        zip.extractAllTo(tempDir, true);

        // 检查 ZIP 文件结构并移动内容到目标目录
        const zipEntries = zip.getEntries();
        const rootDir = zipEntries[0].entryName.split('/')[0];
        const extractedDir = path.join(tempDir, rootDir);
        const targetDir = path.join(process.cwd(), proname);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        const files = fs.readdirSync(extractedDir);
        files.forEach(file => {
            fs.renameSync(path.join(extractedDir, file), path.join(targetDir, file));
        });

        // 删除临时目录和 ZIP 文件
        await fs.promises.rm(tempDir, { recursive: true, force: true });
        fs.unlinkSync(zipFilePath);
        console.log(chalk.yellowBright(`-- cd ${proname}`));
        console.log(chalk.yellowBright('-- pnpm i  安装依赖'));
    } catch (error) {
        spinner.fail(chalk.red('下载失败'));
        console.error('Error:', error.message);
    }
}
