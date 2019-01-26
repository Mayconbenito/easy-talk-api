# chat-api
To get the api documentation go to: https://next.stoplight.io/maycon-benito/chat/version%2F1.0/chat.oas2.yml?view=/

### Installation

Install the dependencies.

```sh
$ npm install
```

### VSCODE Setup
Install Editorconfig, prettier and eslint

##### Workspace Settings
#

```
{
  "editor.formatOnSave": true,
  "prettier.eslintIntegration": true
}
```

### dotenv enviroment

```sh
# .dotenv
# SERVER
SERVER_PORT =

# MYSQL
MYSQL_HOST = 
MYSQL_PORT =
MYSQL_USER =
MYSQL_PASSWORD =
MYSQL_DATABASE =

#JWT 
JWT_HASH =

APP_KEY =
```

### Running the project

```
$ npm run dev
