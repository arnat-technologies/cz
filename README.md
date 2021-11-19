# Arnat CZ Adapter for Commitizen

> :sparkles: A [adapter](http://npm.im/arnat-cz) with strong standards Tech industries.

[![NPM](https://nodei.co/npm/arnat-cz.png?downloads=true&stars=true)](https://nodei.co/npm/arnat-cz/)

```shell
? Selecciona el tipo de cambio que estas enviando: (Use arrow keys)
❯ ✨  Feat:      A new feature
  🐛  Fix:       A bugfix
  📚  Docs:      Documentation updates
  🎨  Style:     No side effects on code
  🔨  Refactor:  Code change
  🚀  Perf:      Improve performance
  🚨  Test:      Add or update unit tests
  👷  Chore:     Build changes on tools
```

## Instalation

```
yarn global add @arnat/cz
# or
npm install --global @arnat/cz

establecer como adaptador predeterminado globalmente
echo '{ "path": "arnat-cz" }' > ~/.czrc
```

## Development

run `npm run reload` and invoke it with `git cz`

Uninstall it after testing: `npm uninstall -g @arnat/cz`

## Use

Run `git cz` instead `git commit` View [Commitizen](https://github.com/commitizen/cz-cli) for more information.

## Configuration

Configs are applied in the following order:

1. `package.json`
2. `.cz.json`
3. `.czrc`

```js
// in package.json
"config": {
  "commitizen": {
    // ...
    "arnat-cz": {
      // Overwrite types prompted to the command line.
      "types": {
        "Fix": {
          "emoji": "🐝", // overwrite "Fix" emoji to a bee
          "name": "Bug", // overwrite "Fix" name to "Bug"
          "description": "Dirty bug" // overwrite description of "Fix"
        },
        // add a new type "Chore"
        "Chore": {
          "emoji": "❓",
          "description": "Other changes that don't modify src or test files"
        }
      },

      // Overwrite the output commit subject in the specified format.
      // Below is the default format,
      // [emoji] will be replace with the chose type's emoji,
      // [name] will be replace with the chose type's name,
      // [subject] will be replace with the subject you entered.
      // One example output of the format can be: `✨ Feat: initial commit`
      "format": "[emoji] [name]: [subject]"
    }
  }
}

// in .cz.json or .czrc
{
  "arnat-cz": {
    //...
  }
}
```

## Author

Arnat Technologies <info@arnat.digital>

## Licence

[MIT](LICENSE)
