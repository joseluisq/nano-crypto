const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const travisLaunchers = {
    chrome_travis: {
        base: "Chrome",
        flags: ["--no-sandbox"]
    }
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : ["Chrome"]

module.exports = (config) => {
    const env = process.env["NODE_ENV"] || "development"

    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-typescript",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter",
            "karma-spec-reporter"
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files: [
            { pattern: "src/**/*.browser.ts" },
            { pattern: "tests/**/*.browser.spec.ts" },
            { pattern: "src/shared/**/*.ts" }
        ],
        preprocessors: {
            "**/*.browser.ts": ["karma-typescript"],
            "tests/**/*.browser.spec.ts": ["karma-typescript"],
            "src/shared/**/*.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                lib: [
                    "es2017",
                    "dom",
                    "es2015.generator",
                    "es2015.iterable",
                    "es2015.promise",
                    "es2015.symbol",
                    "es2015.symbol.wellknown",
                    "esnext.asynciterable"
                ]
            }
        },
        reporters: ["progress", "kjhtml"],
        colors: true,
        logLevel: env === "debug" ? config.LOG_DEBUG : config.LOG_INFO,
        autoWatch: true,
        browsers: localBrowsers,
        singleRun: false
    })
}
