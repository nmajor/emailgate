Started with a pull from [mern-starter](https://github.com/Hashnode/mern-starter).

### To run

npm start

### Changes from mern Starter

- Pulled out files into their parent directory when there was like only one file in the dir with the same name of the dir
- Removed the cross-env lib in package.json. Its a thing only for windows.
- Added sass loaders for webpack: npm install sass-loader node-sass --save-dev


### Notes

https://github.com/zippyui/react-date-picker

https://www.npmjs.com/package/html-pdf
https://www.npmjs.com/package/phantom-html-to-pdf

https://github.com/zenoamaro/react-quill
https://facebook.github.io/draft-js/

https://github.com/mozilla/pdf.js/blob/master/examples/learning/prevnext.html

// This might be a better html to pdf lib (PROBABLY NOT)
https://github.com/MrRio/jsPDF

// Possible option
https://www.npmjs.com/package/pdf-merge

// This one looks good but not used often and github link is dead
https://www.npmjs.com/package/spindrift

// Looks like most of these libraries are just wrappers around this pdftk utility
https://www.pdflabs.com/tools/pdftk-server/
https://www.pdflabs.com/docs/pdftk-man-page/
https://www.npmjs.com/package/scissors

// Example pdftk merge command
pdftk A=even.pdf B=odd.pdf cat A B output -

// Looks like there is a problem with pdftk on MacOS.
http://stackoverflow.com/questions/32505951/pdftk-server-on-os-x-10-11

### Todo Short

- Make a compilation wrapper component to load the compilation emails, pages, page map, everything the compilation needs on fresh page and in component did mount. Maybe show loading gif until all things are loaded. Also make sure to set all compilation state related stuff to be blank while loading the new data. (This should automatically fix the issue with blank page numbers in the table of contents.)
- Need to add the correct page numbers to the bottom of the email pages.
- Handle the currentFilteredEmail through the url instead of state.
- Load images in email previews
- Save the compilation title and subtitle separately to populate the cover and title page with the same data
- Generate the finalized pdf
- Fix the pdfs for the title page and message page. There is an extra blank page at the bottom.


### Todo Long

- Make the date picker more intuitive. Like make sure any incomplete end date settings jump to the end of the given data. Like if only the year. go to the end of the year. If only year and month go to the end of the month. But keep the start date stuff to go to the beginning of the given data.
- Sanitize email body text before save.
- Reconnect the socket after login, registration, and logout.
- Auto redirect to dashboard after login and registration.
- Make sure registration logs you in.
- Add email confirmation to users.


### Container Notes

- The container will need to install pdftk: apt-get install pdftk
