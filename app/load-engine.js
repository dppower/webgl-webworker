importScripts(
    "scripts/systemjs/dist/system-polyfills.js",
    "scripts/systemjs/dist/system.src.js",
    "scripts/angular2/bundles/angular2-polyfills.js",
    "scripts/angular2/bundles/web_worker/worker.dev.js"
);

System.config({
    packages: {"engine": {defaultExtension: "js"}}
});

System.import("engine/main");