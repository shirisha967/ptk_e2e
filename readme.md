# PTK E2E

# What is it?

PTK E2E is a set of Cypress end-to-end scripts for testing Connect, Marketing and Client Portal.

# Requirements

Use node v12. [NVM](https://github.com/nvm-sh/nvm) is a utility that will enable you to have multiple versions of node
on your machine simultaneously.

# How to install

Clone this repository somewhere on your machine, go into the directory and run npm install.

# How to run

There are a few ways to run the scripts.

First, you can open the test runner by running `npx cypress open` at the command line to launch a GUI from where you
can run individual scripts.

Secondly, you can run `npx cypress run` at the command line to run all script headlessly.

Lastly, if you wanted to run a specific section of tests headlessly you can use something like
`npx cypress run --spec "cypress/integration/connect/**.**"`. Alternatively, replace the `**.**`
which the full name of a file to run that test on its own.

You can select which browser engine to use with the commandline parameter `-b chrome`. We have experienced problems
(crashes) when using electron, so chrome is preferred.

# More info about Cypress.

To find out more about Cypress visit their site at http://www.cypress.io

# Editing

When using windows it is recommended that you configure git to keep unix file endings when checking out code
(`core.autocrlf=false`).
Even [Windows Notepad now supports reading and writing with unix-line endings](https://devblogs.microsoft.com/commandline/extended-eol-in-notepad/)
so there is no reason to use crlf at all.

When making changes, please install [pre-commit](https://pre-commit.com/) a tooling system that prevents committing code
that does not match our requirements. In many cases it fixes the code automatically, requiring you to simply review the
changes and add them to the commit. Others can not be automatically fixed and require you to review the errors and fix
them yourself. The rules implemented are:

## Checks that automatically fix the problem

-   Strips redundant utf-8 BOM characters
-   Trim any trailing whitespace from lines
-   Ensures that a file is either empty, or ends with one newline
-   Remove windows line endings(crlf), replacing them with unix line ending(lf)
-   Use prettier to format JavaScript code

##Checks that require manual intevention to fix

-   Check for files that contain merge conflict strings
-   Filenames must be lower-case alphanumeric with only underscores, hyphens, and full-stops/periods
-   JSON Syntax Check
-   YAML Syntax Check
