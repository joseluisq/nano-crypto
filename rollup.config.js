import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import pkg from "./package.json"

const format = process.env.MODULE_FORMAT || "cjs"
const filename = process.env.MODULE_FILENAME

const isUMD = (format === "umd")
const file = "./dist/" + (isUMD ? filename + ".min.js" : filename + ".js")
const output = {
    name: pkg.name.replace("-", "_"),
    file,
    format,
    sourcemap: false,
    exports: "named"
}
const plugins = [
    typescript()
]

if (isUMD) {
    plugins.push(resolve())
    plugins.push(terser())
    plugins.push(commonjs({
        sourceMap: false
    }))
}

export default {
    input: `src/${filename}.ts`,
    output,
    plugins,
    onwarn
}

function onwarn(message) {
    const suppressed = ["UNRESOLVED_IMPORT", "THIS_IS_UNDEFINED"]

    if (!suppressed.find((code) => message.code === code)) {
        return console.warn(message.message)
    }
}
