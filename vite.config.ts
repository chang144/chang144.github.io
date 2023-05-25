import alias from "@rollup/plugin-alias";
import {resolve} from 'path'
import {defineConfig} from 'vite'
export default defineConfig({
    plugins: [alias()],
    resolve: {
        alias: {
            "/@": resolve(__dirname, "./src"),
        },
    },
})
