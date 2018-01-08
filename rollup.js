const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const nodeResolve = require("rollup-plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");
const include = require("rollup-plugin-includepaths");
const rxPaths = require("rxjs/_esm5/path-mapping");

const prefix = process.argv[2];
const input = process.argv[3];

function createBundle(input) {
    return rollup.rollup(
        {
            input: input,
            plugins: [
                include({ include: rxPaths() }),
                nodeResolve({
                    jsnext: true,
                    module: true
                }),
                uglify()
            ],
            onwarn(warning) {
                if (warning.code === 'THIS_IS_UNDEFINED') return;
                console.warn(warning.message);
            }
        }
    );
    
}

function writeBundle(bundle, prefix) {
    return bundle.write(
        {
            format: "iife",
            file: "./docs/" + prefix + "-bundle.js",
            sourcemap: true
        }
    );
}

(async function main(input, prefix) {
    console.log(path.join(__dirname, input));
    let bundle = await createBundle(input);
    await writeBundle(bundle, prefix);
})(input, prefix)
.catch(err => {
    console.log(err);
});

