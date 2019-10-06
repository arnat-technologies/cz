# emoji-cz

> :sparkles: Un [adaptador](http://npm.im/emoji-cz) con emoji para commitizen.

[![NPM](https://nodei.co/npm/emoji-cz.png?downloads=true&stars=true)](https://nodei.co/npm/emoji-cz/)

```
? Selecciona el tipo de cambio que estas enviando: (Use arrow keys)
❯ ✨  Feat:      Una nueva característica
  🐛  Fix:       Una corrección de error
  📚  Docs:      Cambios solamente en documentación
  🎨  Style:     Cambios que no afectan el código.
  🔨  Refactor:  Un cambio de código que no corrige un error ni agrega una característica
  🚀  Perf:      Un cambio de código que mejora el rendimiento.
  🚨  Test:      Agregar pruebas faltantes o corregir pruebas existentes
```

## Demo

Solo mira el historial de confirmaciones :point_up:

## Instalation

```
yarn global add @rsurjano/emoji-cz
# O
# npm install --global @rsurjano/emoji-cz

establecer como adaptador predeterminado globalmente
echo '{ "path": "emoji-cz" }' > ~/.czrc
```

## Uso

Simplemente use `git cz` en lugar de`git commit` cuando se comprometa. Ver el documento de [Commitizen](https://github.com/commitizen/cz-cli) para más información.

## Configuraciones

Puede sobrescribir la configuración de 3 formas diferentes, aplicará la configuración en este orden:

1. `package.json`
2. `.cz.json`
3. `.czrc`

```js
// in package.json
"config": {
  "commitizen": {
    // ...
    "emoji-cz": {
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
  "emoji-cz": {
    //...
  }
}
```

## Autor

Roy Surjano <roy@surjano.xyz>

## Licencia

[MIT](LICENSE)
