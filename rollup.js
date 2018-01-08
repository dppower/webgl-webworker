const fs = require("fs");
const rollup = require("rollup");
const nodeResolve = require("rollup-plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");
const include = require("rollup-plugin-includepaths");
const rxPaths = require("rxjs/_esm5/path-mapping");

const prefix = process.argv[2];
const input = process.argv[3];
console.log(prefix);
console.log(input);
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
    let bundle = await createBundle(input);
    await writeBundle(bundle, prefix);
})(input, prefix)
.catch(err => {
    console.log(err);
});

