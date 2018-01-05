importScripts(
    "../scripts/es6-shim/es6-shim.min.js",
    "../scripts/systemjs/dist/system-polyfills.js",
    "../scripts/systemjs/dist/system.src.js",
    "../scripts/angular2/bundles/angular2-polyfills.js",
    "../scripts/angular2/bundles/angular2.dev.js",
    "../scripts/rxjs/bundles/Rx.js",
    "./system-config.js"
);

System.import("game-engine/main").then((module) => { if (module) { console.log("Successfully loaded game-engine/main."); } }, console.error.bind(console));