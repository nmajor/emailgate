Started with a pull from [mern-starter](https://github.com/Hashnode/mern-starter).

### To run

npm start

### Changes from mern Starter

- Pulled out files into their parent directory when there was like only one file in the dir with the same name of the dir
- Removed the cross-env lib in package.json. Its a thing only for windows.
- Added sass loaders for webpack: npm install sass-loader node-sass --save-dev


### Notes

https://github.com/zippyui/react-date-picker


### Todo

- Make the date picker more intuitive. Like make sure any incomplete end date settings jump to the end of the given data. Like if only the year. go to the end of the year. If only year and month go to the end of the month. But keep the start date stuff to go to the beginning of the given data.
