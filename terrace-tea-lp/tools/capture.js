const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const which = process.argv[2] ? process.argv[2].split(',').map(Number) : [...Array(120).keys()];
  const out = process.argv[3] || 'raw';
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('err:', e.message));
  await p.goto('http://127.0.0.1:8765/scene.html');
  await p.waitForFunction('window.ready === true', null, { timeout: 60000 });
  for (const i of which) {
    await p.evaluate(i => window.renderFrame(i), i);
    const data = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
    fs.writeFileSync(`${out}/f_${String(i).padStart(4, '0')}.png`, Buffer.from(data.split(',')[1], 'base64'));
    if (i % 20 === 0) console.log('frame', i);
  }
  await b.close();
})();
