import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  preset: process.env.NITRO_PRESET,
  srcDir: 'src/',
  rootDir: '.',
  alias: {
    '@': '~',
    '@t': '~/test',
  },
});
