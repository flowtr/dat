# Dat

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Linting By ESLint](https://raw.githubusercontent.com/aleen42/badges/master/src/eslint.svg)](https://eslint.org)
[![Typescript](https://raw.githubusercontent.com/aleen42/badges/master/src/typescript.svg)](https://typescriptlang.org)

A cli command currently for manipulating json data.

## Intro

This is a cli command that can parse and manipulate json data. It acts like `jq` but uses JSON5 behind the scenes so that you can use features like comments in the input data.

## Installation

```bash
npm i -g @flowtr/dat
```

## Usage Example

Say you have a `.json5` file like

```json5
[
    {
        name: "task1",
        cmd: "echo hi",
    },
    {
        name: "task2",
        cmd: "echo hi",
    },
]
```

and you want to filter out all tasks but the task with a name of "task2":

```bash
cat tasks.json5 | dat -s ".filter(i => i.name == 'task2')"
```

**Dat** simply uses the power of javascript to manipulate data.

If you want to use typescript, you can do that too (notice the `-t` flag):

```bash
cat tasks.json5 | dat -t -s ".filter(i => i.name == 'task2')"
```
