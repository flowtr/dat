import yargs from "yargs";
import { NodeVM } from "vm2";
import * as babel from "@babel/core";
import color from "colorette";
import JSON5 from "json5";

const argv = yargs(process.argv.slice(2))
    .scriptName("boop")
    .options({
        script: { type: "string", alias: "s" },
        help: { type: "boolean", alias: "h" },
        transpile: {
            type: "boolean",
            alias: "t",
            desc: "Transpiles TS to JS using babel",
        },
    })
    .completion()
    .parse();

const vm = new NodeVM({
    console: "inherit",
    sandbox: {},
    require: {
        builtin: ["fs", "path"],
        external: true,
        root: `${process.cwd()}`,
    },
    wrapper: "commonjs",
});

if (argv.help) {
    yargs.showHelp();
    process.exit(0);
}

// let input = "";

const stdin = process.openStdin();
stdin.addListener("data", (input) => {
    if (argv.script) {
        if (argv.transpile)
            babel
                .transformAsync(
                    `
        export default (input: string) => {
            return input${argv.script}
        }
        `,
                    {
                        presets: ["@babel/preset-typescript"],
                        plugins: ["@babel/plugin-transform-modules-commonjs"],
                        filename: "boop-script.ts",
                    }
                )
                .then((transpiled) => {
                    if (!transpiled || !transpiled.code) {
                        console.error(color.red(`Failed to transpile!`));
                        process.exit(1);
                    }

                    console.log(
                        vm
                            .run(transpiled!.code!, "boop-script.js")
                            .default(JSON5.parse(input))
                    );
                })
                .catch((err) => {
                    console.error(color.red(`Failed to transpile: ${err}`));
                    process.exit(1);
                });
        else
            console.log(
                vm.run(
                    `
                module.exports = (input) => {
                    return input${argv.script}
                }
                `,
                    "boop-script.js"
                )(JSON5.parse(input))
            );
    }
});
