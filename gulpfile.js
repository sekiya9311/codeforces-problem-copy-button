const gulp = require('gulp');
const fs = require('fs');
const webpack = require('webpack');
const WebpackStream = require('webpack-stream');

const WebpackConfig = require('./webpack.config');
const UserScriptHeader = fs.readFileSync('./UserScriptHeader.js', 'utf8');

const WebpackTaskName = 'webpack';
const GenerateUserscriptTaskName = 'generate-userscript';
const DefaultTaskName = 'default';

gulp.task(WebpackTaskName, () => {
  return WebpackStream(WebpackConfig, webpack).pipe(gulp.dest('./build/'));
});

gulp.task(GenerateUserscriptTaskName, gulp.series(WebpackTaskName, (done) => {
  const convertedSourceOfWebpack = fs.readFileSync('./build/bundle.js', 'utf8');
  fs.writeFileSync('./build/codeforces-problem-copy-button.user.js', 
                   UserScriptHeader + '\n' + convertedSourceOfWebpack);
  fs.unlinkSync('./build/bundle.js');
  done();
}));

gulp.task(DefaultTaskName, gulp.series(GenerateUserscriptTaskName, (done) => done()));