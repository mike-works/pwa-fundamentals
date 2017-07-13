<p align='center'>
  <a href="https://mike.works" target='_blank'>
    <img height=40 src='https://assets.mike.works/img/login_logo-33a9e523d451fb0d902f73d5452d4a0b.png' />
  </a> 
</p>
<p align='center'>
  <a href="https://mike.works/course/progressive-web-fundamentals-0d74af5" target='_blank'>
    <img height=150 src='https://user-images.githubusercontent.com/558005/28080773-5f563b0c-666d-11e7-82e1-40d7320b73ce.png' />
  </a>
</p>
<p align='center'>
  <a href="https://greenkeeper.io/" title="Dependencies">
    <img title="Greenkeeper" src="https://badges.greenkeeper.io/mike-north/pwa-workshop.svg"/>
  </a>
  <a href="https://travis-ci.org/mike-north/pwa-workshop" title="Build Status">
    <img title="Build Status" src="https://travis-ci.org/mike-north/pwa-workshop.svg?branch=solutions"/>
  </a>
  <a href="https://mike.works/course/progressive-web-fundamentals-0d74af5" title="Modern JavaScript">
    <img title="Course Outline" src="https://img.shields.io/badge/mike.works-course%20outline-blue.svg"/>
  </a>
  <a href="https://docs.mike.works/pwa-fundamentals" title="Slides">
    <img title="Slides" src="https://img.shields.io/badge/mike.works-slides-blue.svg"/>
  </a>
</p>
<p align='center'>
This is the example project used for the <a title="Mike Works, Inc." href="https://mike.works">Mike</a> and <a href="http://stevekinney.net">Steve's</a> <a title="PWA Fundamentals" href="https://mike.works/course/progressive-web-fundamentals-0d74af5">PWA Fundamentals</a> course.
</p>

# Setup

Please make sure you have the following software installed before arriving at the workshop or beginning the course.

#### General Packages

Please make sure you have the following general software installed

| Required | Library | Version Range | Notes |
| ------------- | ------------- | ---| --- |
| ✔ | [Node.js](http://nodejs.com/)  | >= 6.4 | [nvm](https://github.com/creationix/nvm) is highly recommended for managing multiple node versions on a single machine |
| ✔ | [Visual Studio Code](https://code.visualstudio.com/)  | >= 1.14 | We'll be using several specific features of the VS Code editor. We can't force you to use it, but you'll miss out if you don't! |
|   | [Yarn](https://yarnpkg.com/)  | >= 0.24 | An alternative to [npm](https://github.com/npm/npm) |

#### VS Code Extensions

Additionally, to take advantage of syntax hilighting, static code analysis and other editor features, you'll want to install the latest version of the following VS Code extensions

| Required | Extension | Notes |
| ------------- | ------------- | --- |
| ✔ | [sass-indented](https://marketplace.visualstudio.com/items?itemName=robinbentley.sass-indented) | Syntax highlighting and code completion support for [Sass](http://sass-lang.com) stylesheets |
| ✔ | [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | Static code analysis for JavaScript and JSX files |
| ✔ | [jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) | Syntax highlighting for [Jest snapshot testing](https://facebook.github.io/jest/docs/snapshot-testing.html) and in-editor test pass/fail statuses |
| ✔ | [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint) | Stylesheet linting |
|   | [vscode-icons](https://marketplace.visualstudio.com/items?itemName=robertohuertasm.vscode-icons) | Better file and folder icons |
|   | [rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) | An in-editor REST client, so we can experiment with our API effortlessly |

#### Global Node.js Packages

Make sure you have these npm packages installed globally. This can be done by running

```
npm install -g <package-name>
```

| Required | Library | Version Range |
| ------------- | ------------- | ---|
| ✔ | [babel-eslint](https://github.com/babel/babel-eslint)  | ^7.0.0 |
| ✔ | [eslint](https://github.com/eslint/eslint) | ^4.0.0 |
| ✔ | [eslint-plugin-babel](https://github.com/babel/eslint-plugin-babel)  | ^4.0.0 |
| ✔ | [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)  | ^7.1.0 |

# Files and Folders

This is a free-standing client/server Progressive Web App system, including

* A database
* A REST API
* A web client, which starts out as a conventional single-page app, and becomes a progressive web app you progress through the workshop

````
 Project
 │
 ├─ client/            📱 React.js web client
 │  ├─ components/     📊 React components
 │  │  │
 │  │  ├─ my-thing/index.jsx        Component implementation
 │  │  ├─ my-thing/index.text.js    Component tests
 │  │  └─ my-thing/styles.scss      Component styles
 │  │
 │  ├─ routes/         🔝 Top-level React components, each corresponding to a "page" in our app
 │  ├─ sass/           💅 Global Sass stylesheets
 │  ├─ app.jsx         🎁 React "App" component  
 │  ├─ index.js        🎬 Web client entry point
 │  └─ index.ejs       📄 Template for web client index.html
 │
 ├─ db/                💾 SQLite databases
 ├─ dist/              📦 Web client development/production builds
 ├─ server/            🛒 Node.js API to support the web client
 └─ webpack/           ⚙️ Build configuration 
````

# How to use it

#### Generate x509 Certificates for serving over HTTPS

`npm run prepcerts`

#### Start the Development Server
`./run serve`

or in HTTP/2 mode (requires a development or production build, and does not watch for changes)

`./run serve --http2`

#### Build Development Assets in the `/dist` folder
This will be an un-minified version of an exercise, and will include some webpack-specific tooling, intended only for development use

`npm run build:dev`

#### Build Production Assets in the `/dist` folder
This will be an an optimized version of the exercise

`npm run build:dist`

#### Run tests

`npm test`

#### Clean old builds

`npm run clean`

# What are the pieces?

* [Webpack 3](https://webpack.js.org)
* [Babel](http://babeljs.io/) 7.x, setup with the [babel-preset-env](https://github.com/babel/babel/tree/7.0/packages/babel-preset-env) plugins, compiling to ES5 JavaScript
* [ESLint](https://github.com/eslint/eslint) for linting JS and JSX
* [sass-loader](https://github.com/webpack-contrib/sass-loader) for traditional management of [Sass](http://sass-lang.com/) styles
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) so compiled styles are external stylesheets instead of inline style blocks
* [React](http://facebook.github.io/react/) as a component library
* [MUI](https://www.muicss.com/) as a lightweight (6.6K) Material Design inspired UI kit
* [Jest](http://facebook.github.io/jest/) as a testing platform
* [SimpleHTTP2Server](https://github.com/GoogleChrome/simplehttp2server) as a HTTP/2 proxy (for development only)
* [SQLite3](https://www.sqlite.org/) - as a lightweight, embedded database (for API)
* [Express](http://expressjs.com/) - as a HTTP server for our API.

# License
While the general license for this project is the BSD 3-clause, the exercises
themselves are proprietary and are licensed on a per-individual basis, usually
as a result of purchasing a ticket to a public workshop, or being a participant
in a private training.

Here are some guidelines for things that are **OK** and **NOT OK**, based on our
understanding of how these licenses work:

### OK
* Using everything in this project other than the exercises (or accompanying tests) 
to build a project used for your own free or commercial training material
* Copying code from build scripts, configuration files, tests and development 
harnesses that are not part of the exercises specifically, for your own projects
* As an owner of an individual license, using code from tests, exercises, or
exercise solutions for your own non-training-related project.

### NOT OK (without express written consent)
* Using this project, or any subset of 
exercises contained within this project to run your own workshops
* Writing a book that uses the code for these exercises
* Recording a screencast that contains one or more of this project's exercises 


# Copyright

&copy; 2017 [Mike Works, Inc.](https://mike.works) and [Steve Kinney](http://www.stevekinney.net), All Rights Reserved

###### This material may not be used for workshops, training, or any other form of instructing or teaching developers, without express written consent

