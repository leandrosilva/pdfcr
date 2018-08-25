const chromeLauncher = require('chrome-launcher');
const htmlPdf = require('html-pdf-chrome');

const CHROME_BIN = process.env.CHROME_BIN;
const CHROME_PORT = process.env.CHROME_PORT || 9222;
const CHROME_ARGS = ['--headless',
                     '--interpreter none',
                     '--no-sandbox',
                     '--disable-gpu',
                     '--disable-translate',
                     '--disable-extensions',
                     '--disable-background-networking',
                     '--disable-sync',
                     '--disable-default-apps',
                     '--disable-web-security',
                     '--safebrowsing-disable-auto-update',
                     '--metrics-recording-only',
                     '--no-first-run',
                     '--mute-audio',
                     '--hide-scrollbars',
                     `--remote-debugging-port=${CHROME_PORT}`];
const CHROME_LAUNCH_OPTIONS = {
  chromePath: CHROME_BIN,
  chromeFlags: CHROME_ARGS,
  port: CHROME_PORT,
  ignoreDefaultFlags: true
};

const CONVERT_OPTIONS = {
  port: CHROME_PORT, // port Chrome is listening on,
  ___completionTrigger: new htmlPdf.CompletionTrigger.Variable(
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

async function convertToBuffer(url, options) {
  let pdf = await htmlPdf.create(url, options);
  return pdf.toBuffer();
}

function createSuccessResponse(content) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf'
    },
    isRaw: true,
    body: content
  };
}

function createErrorResponse(message, reason) {
  return {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    },
    body: { message: message, reason: reason } 
  };
}

module.exports = async function (context, req) {
	context.log(`pdfcr::converter >> ${req.query.page}`);
	
	let payload = {
		'page' : req.query.page,
		'options': CONVERT_OPTIONS
  };
  
  await chromeLauncher.launch(CHROME_LAUNCH_OPTIONS).then(async chrome => {
    context.log(`chrome is listening on port ${CHROME_PORT}`);

    await convertToBuffer(payload.page, payload.options).then(content => {
      context.log(`pdfcr::converter >> content size [${content.length} bytes]`);
      context.res = createSuccessResponse(content);
      context.log(`pdfcr::converter >> ${payload.page} >> DONE`);
    })
    .catch(err => {
      context.log(`fail to convert: ${err}`);
      context.res = createErrorResponse(`Failed to convert page ${payload.page}`, err);
    });
  })
  .catch(err => {
    context.log(`failed to launch chrome: ${err}`);
  });
};