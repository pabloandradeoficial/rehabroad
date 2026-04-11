const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`Error log: "${msg.text()}"`);
  });

  // Login
  await page.goto('https://019c2fbd-8a66-73a6-aa9f-663d3e6c8af7.rehabroad.workers.dev/login');
  // Wait, I don't have login credentials. I can't reach the dashboard easily.
  // Unless we simulate it. But actually we CAN see the code!
  await browser.close();
})();
