<p align='center'>
  <a href="https://mike.works" target='_blank'>
    <img height=40 src='https://assets.mike.works/img/login_logo-33a9e523d451fb0d902f73d5452d4a0b.png' />
  </a> 
</p>
<p align='center'>
  <a href="https://mike.works/course/progressive-web-fundamentals-0d74af5" target='_blank'>
    <img height=150 src='https://cloud.githubusercontent.com/assets/558005/25995673/c8d86ce6-3713-11e7-8a18-9c85bcf73fc9.png' />
  </a>
</p>
<p align='center'>
  <a href="https://travis-ci.org/mike-north/pwa-fundamentals" title="Build Status">
    <img title="Build Status" src="https://travis-ci.org/mike-north/pwa-fundamentals.svg?branch=solutions"/>
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

# How to use it

##### Start the Development Server
`npm start <exercise-name>`

##### Build Development Assets in the `/dist` folder
This will be an un-minified version of an exercise, and will include some webpack-specific tooling, intended only for development use

`npm run build:dev <exercise-name>`

##### Build Production Assets in the `/dist` folder
This will be an an optimized version of the exercise

`npm run build:dist <exercise-name>`

## The Exercise Folder
Exercises are standalone mini-projects with the following folder structure.
```sh
index.html   # HTML served for exercise
./src        # Scripts (js and jsx)
   ⌙ index.js -     # Entry point for the mini-project
./styles     # Styles
   ⌙ app.scss       #  (optional) Entry point for styles
./tests      # Tests
   ⌙ myfile.test.js # Tests must have *.test.js
```

## Global stuff
Global styles can be placed in `public/styles/app.scss`. These are available across all examples

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

