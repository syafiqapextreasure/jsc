import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser', timeout:30000, workers:2,
 use:{baseURL:'http://127.0.0.1:4173',channel:process.env.CI?'chrome':undefined,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'node scripts/dev.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
 reporter:[['list'],['html',{open:'never'}]],
});
