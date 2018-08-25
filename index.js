const { exec } = require('child_process');
const htmlPdf = require('html-pdf-chrome');

const chromeExec = process.env.CHROME_BIN;
const chromeCommand = `"${chromeExec}" \
  --interpreter none \
  --headless \
  --no-sandbox \
  --disable-gpu \
  --disable-translate \
  --disable-extensions \
  --disable-background-networking \
  --disable-sync \
  --disable-default-apps \
  --disable-web-security \
  --safebrowsing-disable-auto-update \
  --metrics-recording-only \
  --no-first-run \
  --mute-audio \
  --hide-scrollbars \
  --remote-debugging-port=19222`;

async function startChrome() {
  return exec(chromeCommand);
}
  
const options = {
  port: 19222, // port Chrome is listening on,
  _completionTrigger: new htmlPdf.CompletionTrigger.Variable(
    'pageIsReady', // optional, name of the variable to wait for. Defaults to 'htmlPdfDone'
    5000 // optional, timeout (milliseconds)
  ),
  printOptions: {
    printBackground: true,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    // scale: 1,
    // scale: 0.24,     // A1 -> A5
    scale: 0.70,        // A4 -> A5
    landscape: true,
    /*
    paperWidth: 23.4,   // A1
    paperHeight: 33.1,
    */
   /*
    paperWidth: 8.3,    // A4
    paperHeight: 11.7,
    */
    paperWidth: 5.8,    // A5
    paperHeight: 8.3
  }
};

// const url = 'http://localhost:3000/someawesomecontent';
// htmlPdf.create(url, options).then((pdf) => pdf.toFile('awesome_test_xxx.pdf'));
// htmlPdf.create(url, options).then((pdf) => console.log(pdf.toBase64()));

async function convertToBuffer(url, options) {
  console.log(`target: ${url}`);
  let pdf = await htmlPdf.create(url, options);
  return pdf.toBuffer();
}

async function main() {
  await startChrome().then(result => {
    console.log('chrome is up');

    convertToBuffer('http://google.com', options)
      .then(content => console.log(`content: ${content}`))
      .then(() => console.log('done'))
      .then(() => process.exit())
      .catch(err => console.log(`fail: ${err}`));
  })
  .catch(err => {
    console.log(`fail to start chrome: ${err}`);
  });
}

main();