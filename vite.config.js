import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import vitePluginRequire from "vite-plugin-require";
import electron from 'vite-plugin-electron';
import { resolve } from 'path';
import electronRender from 'vite-plugin-electron-renderer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// https://vitejs.dev/config/
export default defineConfig((config) => {
    return {
				server: {
					port: 1422,
					proxy: {
						'/api': {
							target: `http://0.0.0.0:${loadEnv(config.mode, process.cwd()).VITE_APP_API_PORT}/`,
							changeOrigin: true,
						},
					}
				},
        plugins: [vue({
					reactivityTransform: true
					}),
					vitePluginRequire(),
					viteMockServe({
						enable: true,
						localEnabled: config.command === 'serve',
						prodEnabled: config.command !== 'serve',
						injectCode: `
							import { setupProdMockServer } from './mockProdServer';
							setupProdMockServer();
						`,
						supportTs: false,
						logger: false,
						mockPath: "./mock/"
					}),
					electron({
						main: {
							entry: './electron/index.js'
						},
						preload: {
							input: './electron/preload.js', // 预加载脚本
						},
					}),
					electronRender(),
					createSvgIconsPlugin({
						iconDirs: [resolve(process.cwd(), './src/assets/svg')],
						symbolId: 'svg-[name]', // 自定义 symbolId 模板
					}),
				],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
