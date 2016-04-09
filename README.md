Started with a pull from [mern-starter](https://github.com/Hashnode/mern-starter).

### To run

npm run start:dev
npm run start:prod

### Changes from mern Starter

- Pulled out files into their parent directory when there was like only one file in the dir with the same name of the dir
- Removed the cross-env lib in package.json. Its a thing only for windows.
- Added sass loaders for webpack: npm install sass-loader node-sass --save-dev
