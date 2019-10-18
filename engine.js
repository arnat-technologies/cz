"format cjs";

var wrap = require("word-wrap");
var map = require("lodash.map");
var longest = require("longest");
var rightPad = require("right-pad");
var chalk = require("chalk");

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

var headerLength = function(answers) {
  return (
    answers.type.name.length +
    2 +
    (answers.scope ? answers.scope.length + 8 : 0)
  );
};

var maxSummaryLength = function(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};

var filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith(".")) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function(options) {
  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function(type, key) {
    var name = type.name || key;
    return {
      name:
        type.emoji +
        "  " +
        rightPad(name + ":", length) +
        " " +
        type.description,
      value: {
        emoji: type.emoji,
        name: name,
        value: key
      }
    };
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      console.log(
        "\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n"
      );

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: "list",
          name: "type",
          message: "Selecciona el tipo de cambio que estas enviando:",
          choices: choices
        },
        {
          type: "input",
          name: "ticket",
          message:
                'Agrega el # del ticket que estas trabajando:\n',
          default: '',
          validate: function (subject, answers) {
            console.log("ticket", subject);
             return subject.length == 0
                 ? "# del ticket es requerido"
                 : true
          },
        },
        {
          type: "input",
          name: "scope",
          message: "¿Cuál es el alcance del cambio (componente o archivo)?: ",
          filter: function(value) {
            return options.disableScopeLowerCase
              ? value.trim()
              : value.trim().toLowerCase();
          }
        },
        {
          type: "input",
          name: "subject",
          message: function(answers) {
            return (
              "Escriba la descripción breve e imperativa del cambio (max " +
              maxSummaryLength(options, answers) +
              " caracteres):\n"
            );
          },
          default: options.defaultSubject,
          validate: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            console.log("filteredSubject", filteredSubject);
            return filteredSubject.length == 0
              ? "descripción es requerida"
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : "La descripción debe ser menos o igual a " +
                maxSummaryLength(options, answers) +
                " caracteres. Ancho actual es " +
                filteredSubject.length +
                " caracteres.";
          },
          transformer: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            var color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red;
            return color("(" + filteredSubject.length + ") " + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: "input",
          name: "body",
          message:
            "Proporcione la descripción detallada: (enter para saltar)\n",
          default: ""
        },
        {
          type: "confirm",
          name: "isBreaking",
          message: "¿Hay BREAKING CHANGES?",
          default: false
        },
        {
          type: "input",
          name: "breaking",
          message: "describe brevemente el BREAKING CHANGE:\n",
          when: function(answers) {
            return answers.isBreaking;
          }
        },
        {
          type: "confirm",
          name: "isIssueAffected",
          message: "¿Este cambio afecta alguna incidencia actual?",
          default: options.defaultIssues ? true : false,
          when: function(answers) {
            return !answers.isBreaking;
          }
        },
        {
          type: "input",
          name: "issues",
          message:
            'Agrega la referencia de la incidencia (e.g. "ticket #123", "bug #123".):\n',
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(function(answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: "\n",
          indent: "",
          width: options.maxLineWidth
        };

        // parentheses are only needed when a scope is present
        var scope = answers.scope ? "(" + answers.scope + ")" : "";

        // Hard limit this line in the validate
        var head = (
          answers.type.name +
          scope +
          ": " +
          answers.type.emoji +
          " CNPS-" + answers.ticket.toString() + " "
          (answers.subject.trim())
        ).slice(0, options.maxLineWidth);

        // Wrap these lines at options.maxLineWidth characters
        var body = answers.body ? wrap(answers.body, wrapOptions) : false;

        // Apply breaking change prefix, removing it if already present
        var breaking = answers.breaking ? answers.breaking.trim() : "";
        breaking = breaking
          ? "BREAKING CHANGE: " + breaking.replace(/^BREAKING CHANGE: /, "")
          : "";
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        var issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        commit(filter([head, body, breaking, issues]).join("\n\n"));
      });
    }
  };
};
