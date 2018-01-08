importScripts(
    "./scripts/core-js/client/shim.min.js",
    "./scripts/systemjs/dist/system.src.js",
    "./js/system-config.js"
);

System.import("game-engine")
    .then((module) => {
            if (module) {
                console.log("Successfully loaded game-engine/main.");
            }
        }, console.error.bind(console)
    );