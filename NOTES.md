
### Password Storage Notes
// Good overview of the basic principles of storing hashed passwords
http://stackoverflow.com/a/260829/1556952

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

- Make the page map only have keys for emails with actual page counts. Then update the logic in the table of contents template.
- Account kind selector links need to be restyled.
- Need to remove the isaac part as the default value for the email filter subject.
- I think some duplicates can slip into the compilation emails. Check the select all buttons and take some other precautions to make sure that emails that are saving cant be selected and sent again.
- Something jankey when creating an imap account. Like maybe the password isnt saved or somehthing. Then there is some strange behaviour when checking the connection on the edit page.
- Add loading notifications when submitting all forms. Like login, register, new compilation, when loading the compilations and accounts on the dashboard (Like when going from the home page to the dashboard without a page refresh), when loading the compilation emails (Like when going from the dashboard to the compilation emails page)
- if you switch compilations or create a new one then the compilation emails dont reset. Like you see the emails from the other compilation. The same probably happens with the pages.
- Strange bug when previewing email. The selected eye icon disappears when the pdf loads.
- Save the compilation title and subtitle separately to populate the cover and title page with the same data

### Todo Long

- Make sure that attachments are included when getting the raw emails from gmail.
- Make the date picker more intuitive. Like make sure any incomplete end date settings jump to the end of the given data. Like if only the year. go to the end of the year. If only year and month go to the end of the month. But keep the start date stuff to go to the beginning of the given data.
- Sanitize email body text before save.
- Add email confirmation to users.

### Container Notes

- The container will need to install pdftk: apt-get install pdftk

### Finished Todos

- Make it so that the imap password is never saved. Add a password field to the selectAccountItem thingy. In the state, update the account in accounts when the password field changes. Then be sure to submit the password when needed to get emails.
- Make a compilation wrapper component to load the compilation emails, pages, page map, everything the compilation needs on fresh page and in component did mount. Maybe show loading gif until all things are loaded. Also make sure to set all compilation state related stuff to be blank while loading the new data. (This should automatically fix the issue with blank page numbers in the table of contents.)
- Need to add the correct page numbers to the bottom of the email pages.
- Load images in email previews
- Generate the finalized pdf
- Make sure registration logs you in.
- Reconnect the socket after login, registration, and logout.
- Auto redirect to dashboard after login and registration.


### Oath2 Notes

http://localhost:8000/oath2/google?code=4/BVtDf-G2MQpgapPv8yc9cw9w74SvOUsO7Be0HbwTnPA#

// Gmail API Docs
https://developers.google.com/gmail/api/

// Google API Client Library
https://github.com/google/google-api-nodejs-client/

// Google API Auth Library
https://github.com/google/google-auth-library-nodejs

// -- Google API Manager info

// Authorized origin:
http://eb.nmajor.com

// Authorized redirect URI:
http://eb.nmajor.com/oath2/google


### Marketing Notes

- Military people may also be interested in it to compile their emails whilst away from home or their families emails while whey were away
- Personal email newsletters
- Messages over time with family or loved ones
