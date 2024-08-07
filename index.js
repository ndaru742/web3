const axios = require('axios');
const moment = require('moment');
const readlineSync = require('readline-sync');
const puppeteer = require('puppeteer');
const address = '0xA0b135007667900374B281F3e966A941dd6D03FE';
const {
  CronJob
} = require('cron');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi untuk memeriksa status halaman
async function checkStat({ page }) {
  return page.evaluate(() => {
      const htmlContent = document.querySelector('html')?.innerHTML.toLowerCase() || '';
      return htmlContent.includes('challenges.cloudflare.com/turnstile') ? { code: 1 } : { code: 0 };
  });
}

// Fungsi utama untuk menangani tantangan Cloudflare Turnstile
async function checkWebsite() {
  let browser;
  try {
    const browser = await puppeteer.launch({  headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']}); // headless: false agar Anda bisa melihat browser
    const page = await browser.newPage();
    await page.goto('https://artio.faucet.berachain.com/');
    
    let stat = { code: 0 };

    // Pengecekan berkala
    while (stat.code !== 1) {
        await sleep(2000); // Tunggu 2 detik sebelum memeriksa lagi
        stat = await checkStat({ page });
    }

    // Tangani tantangan jika terdeteksi
    try {
        // Ambil frame pertama dan klik iframe
        const [frame] = page.frames();
        await page.click('iframe');

        // Ambil child frame pertama dan interaksi dengan checkbox
        const [childFrame] = frame.childFrames();
        if (childFrame) {
            await childFrame.hover('[type="checkbox"]').catch(() => {});
            await childFrame.click('[type="checkbox"]').catch(() => {});
        }
        
        return { code: stat.code };
    } catch (error) {
        console.error('Terjadi kesalahan saat menangani frame:', error);
        return 'error';
    }
  } catch (err) {
    console.error('Failed to check website:', err.message.red);
    return 'error';
  } finally {
    if (browser) await browser.close();
  }

}

async function run() {
  try {
      const result = await checkWebsite();
      console.log('Hasil:', result);
  } catch (error) {
      console.error('Kesalahan:', error);
  }
}

async function run1111() {

  // Luncurkan browser
  const browser = await puppeteer.launch({  headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']}); // headless: false agar Anda bisa melihat browser
  const page = await browser.newPage();

  // Akses halaman web
  await page.goto('https://artio.faucet.berachain.com/');

   // Tunggu hingga elemen checkbox terlihat di halaman
   await page.waitForSelector('input[type="checkbox"]');
    
   // Temukan elemen checkbox dan klik
   await page.click('input[type="checkbox"]');
   
   console.log('Checkbox clicked successfully.');

  // Tutup browser
  
}

async function run1() {

  const token = 'Bearer 0.d9tXMxruu78HAUw4hkkuXpwnx4x62-OfVvf7-LfO4BDy2hB4eUNv8tXldC6UXfy11W6-wHExzNq90sTKkdKSyS7-UM4cSDqslYVgw1gImBOd4VWVVBTUS7v8ueuyRL2mOdxRN5VJcrzx7iNjYCUgUfg3jCjTxHEnwyDn7xQ8VkzotrRtHpIHagtJUvTLxrujPegeWj2BHHVPopVvTmIMYByMduG0n3wdhRNJCyCv-h29gj4km0oFRN9rxGT0HayH5NmQR90684PLuVoBPPwiVipTmuOA-_rOfEDQweYvgUIDl5F7RcxgRf5RzqADjFIiMSerJpUnCmf2qGt5EOQrisyX6I3MO-8XUQxNG_QdGZaGdNvJEB9WXGRzCID2UliavdYGeGK3mmLhJyhcUpZ4CCSgLdgth44O1m0cAuczThSW60IGkb2U-v3gDMqrxE-m.29skA4Fkw3ANBVNrFQrgKA.db853d2b0b315aa2c8174848351edd200f0310897130251e24006b9cfc1fa059';
  while (true) {
    try {
      //console.log(token);
      const response = await axios.post(
        'https://bartio-faucet.berachain-devnet.com/api/claim?address=0xA0b135007667900374B281F3e966A941dd6D03FE', {
          address: '0xA0b135007667900374B281F3e966A941dd6D03FE',
        }, {
          headers: {
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            Origin: 'https://bartio.faucet.berachain.com',
            Pragma: 'no-cache',
            Priority: 'u=1, i',
            Referer: 'https://bartio.faucet.berachain.com/',
            'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Linux"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            Authorization: token,
          },
        }
      );

      console.log(`[${moment().format('HH:mm:ss')}] response : `, response.data.msg);

    } catch (error) {
      console.log('error : ', error.response.data.msg);
      const msg = error.response.data.msg;
      const durationMatch = msg.match(/(\d+h)?(\d+m)?(\d+s)/);
      if (durationMatch) {
        const waktu = (parseInt(durationMatch[1]) * 60 * 60 * 1000) + (parseInt(durationMatch[2]) * 60 * 1000) + (parseInt(durationMatch[3]) * 1000) + 5000;
        console.log(`[${moment().format('HH:mm:ss')}] menunggu... `, waktu);
        await delay(waktu);
      } else {
        await delay(2000);
      }
    }
    await delay(2000);
  }
}
async function runClaim1() {
  try {

    const response = await axios.get(
      'https://bartio-faucet.berachain-devnet.com/api/info',

      {
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          Origin: 'https://bartio.faucet.berachain.com',
          Pragma: 'no-cache',
          Priority: 'u=1, i',
          Referer: 'https://bartio.faucet.berachain.com/',
          'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Linux"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',

        },
      }
    );

    console.log('res : ', response.data);
    //return response.success;
  } catch (error) {
    console.log('error : ', error.response.data);
  }
}

async function run21() {

  const token = '_ga=GA1.1.1524383510.1720565370; _ga_HKF32BE9WV=GS1.1.1721670153.3.0.1721670153.0.0.0; __gads=ID=86967d49f4799d8f:T=1720880800:RT=1722618336:S=ALNI_MaXo6TUYF6LOGWV1oo8pbbugYNR2Q; __gpi=UID=00000e8fdfe018ab:T=1720880800:RT=1722618336:S=ALNI_MZmOaBJRyM6vloONr7i9I6KqMOzEg; __eoi=ID=87f54c0e084d3c7f:T=1720880800:RT=1722618336:S=AA-AfjZ2KvnHF9VTwx_KlzMu2E0Z; _ga_VYVRX4JP57=GS1.1.1722618336.16.0.1722618341.0.0.0; FCNEC=%5B%5B%22AKsRol90hFiGYAtq1aqGE0XY7nJPTs0KaxzYcrSTamth9Ob7ZnP3FzW8-zHreKmMK9nMWrDnS9w7T_tjaA3ziBFxQjxvyWeVninGbaqwuv-YFqmdZKwtydYw3kKGO5WEgp0yL1sLTSr2PGVU7L-Fn5Yd5XK7OPCoKA%3D%3D%22%5D%5D';

  try {
    //console.log(token);
    const response = await axios.post(
      'https://faucet.morkie.xyz/api/send', {
        address: '0xA0b135007667900374B281F3e966A941dd6D03FE',
      }, {
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          Origin: 'https://faucet.morkie.xyz',
          Pragma: 'no-cache',
          Priority: 'u=1, i',
          Referer: 'https://faucet.morkie.xyz/bera',
          'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Linux"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          cookie: token,
        },
      }
    );

    console.log(`[${moment().format('HH:mm:ss')}] response : `, response.data.success);
    return response.data.success;

  } catch (error) {
    if (error.response && error.response.data) {
      console.log('error : ', error.response.data.message);
    } else {
      console.log('error : ', error.message);
    }
  }
  await delay(10000);

}
async function run2() {

  const job = new CronJob(
    '0 0 * * * ', // Setiap 5 detik
    run21,
    null,
    true,
    'Asia/Jakarta'
  );

  job.start();
  console.log(
    'Cron job started! The check-in will run every 24 jam. 🕒'.cyan
  );
}

const userChoice = readlineSync.question(
  '1|2 ? '
);
if (userChoice === '1') {
  run1();
} else if (userChoice === '2') {
  run2();
}else if (userChoice === '3') {
  run();
} else {
  exit();
}