// import Puppeteer from 'puppeteer';
// export type Target = { content?: string; url?: string };

// export async function generatePdf(file: Target, options?: Record<string, any>) {
//     // we are using headless mode
//     let args = ['--no-sandbox', '--disable-setuid-sandbox'];
//     if (options.args) {
//         args = options.args;
//         delete options.args;
//     }

//     const getChromiumPath = () => {
//         const isProd = !process.env.NODE_ENV;
//         const isWin = process.platform === 'win32';
//         if (isWin && isProd) {
//             return Puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
//         }
//         return Puppeteer.executablePath();
//     };

//     const browser = await Puppeteer.launch({
//         args: args,
//         executablePath: getChromiumPath(),
//     });
//     const page = await browser.newPage();

//     if (file.content) {
//         // We set the page content as the generated html by handlebars
//         await page.setContent(file.content, {
//             waitUntil: 'networkidle0', // wait for page to load completely
//         });
//     } else {
//         await page.goto(file.url, {
//             waitUntil: ['load', 'networkidle0'], // wait for page to load completely
//         });
//     }

//     return page.pdf(options).then(async function (data) {
//         await browser.close();
//         return Buffer.from(Object.values(data));
//     });
// }
