
**** Maybe a better lib for pdf generation
- http://wkhtmltopdf.org/


**** Reduce pdf file size:
http://askubuntu.com/questions/113544/how-can-i-reduce-the-file-size-of-a-scanned-pdf-file

### Password Storage Notes
// Good overview of the basic principles of storing hashed passwords
http://stackoverflow.com/a/260829/1556952

### Notes

https://github.com/Automattic/kue

- Stripe Guide
https://davidwalsh.name/step-step-guide-stripe-payments-react

SAMPLE VALID CREDIT CARD NUMBERS
Credit Card	Sample Number
Visa	4111 1111 1111 1111
MasterCard	5500 0000 0000 0004
American Express	3400 0000 0000 009
Diner's Club	3000 0000 0000 04

https://stripe.com/docs/testing

### PDF SIMULTAION NOTES

- http://stackoverflow.com/questions/16977142/html5-js-preprocess-of-uploaded-html-page-and-simulate-pagebreaks


### TOP TODOS:

- Monitor and update email and page pdf jobs and push up completed pdf objects to the client after jobs are done. Client should be updated throughout the process.
- Add a compression step for all generated pdfs.
- Let user know when compilation PDF job is queued and waiting for stuff. Maybe make it so that queuing a compilation pdf waits until the emails and pages jobs are complete before adding the compilation-pdf job to the queue. You could attach to the redis pubsub to watch it. That way you could give more accurate progress to the user by showing how many other email and pdf stuff is left. It also solves the problems that compilation-pdf has when it is at a lower priority than the email and page pdf jobs.
- See how the worker does when it is 2gb in size.
- The prod env is not bulding the css. The css is being loaded through the javascript. Maybe need to add a conditional when including the css file in client/index.js



- Estimate the number of pages in an email pdf
  - Render the email with the email template inside some sort of container div element
  - Set the width of the container div element to the width of the pdf pages setting
  - Get the height of the rendered email template
  - Divide the height by the height of the pdf pages setting minus the vertical padding
  - Done.
  - This is probably lightweight enough to do before save

- Figure out if I can just add the footer with the page number after rendering the document.

- Try to leverage manta jobs to handle the pdftk stitching of the files together. Like even first try uploading all the files on the fly to manta and then using a manta job to stitch them. You would have to upload them fresh every time because of the page numbers unless you can figure out a good way to add them on the fly.
  - http://forums.debian.net/viewtopic.php?t=30598 - How to add page numbers to a pdf with pdftk
  - http://stackoverflow.com/questions/1603301/how-to-add-page-numbers-to-postscript-pdf - Good stackoverflow thread with good options for adding pages to a pdf

- PDF container scripts to offload the pdf generation
  - Save the whole rendered email in the database. Make a template property and save the wrapping html with a find and replaceable part for the {{body}}
  - Save the whole rendered page in the database for all pages
  - ^ These make it so that I can have very lightweight stand alone pdf scripts that only need access to the mongodb in order to make the PDF. That means I dont need to share code between these scrips and the full app code.
  - I should be able to make a different container for each email potentially rendering them nearly all at once.
  - I will still probably want to generate a page map instead of relying on the sequential page numbers some other way. But maybe not.
  - This should make the server part really lightweight.
  - I will probably want to figure out how to pass through some sort of progress report from the output of the container script through to the web app so I cancd update the user on progress.
  - Will also need some sort of way to pass through errors to the web app.
  - Need to make sure the script containers terminate and die so that the net cost is zero when none are in use.
  - May want to email joyent to make sure it is ok to potentially generate 100s of containers all at once with their api. If it would cause lag then maybe consider having each container script generate like 5.
  - But this also means I can have these pdf script containers be quite beefy. I could give them 2GB of ram. But I should do some testing to make sure that it actually adds some sort of difference in speed.
  - Should I have the container script return the pdf url? Or an entire object about the pdf file? I would have to make it work with the progress stream.

- I will probably want to add hooks in the page and email schemas to update the compilation updatedAt field after save. That way I can always know if the compilation pdf is up to date.

### Todo Short
- Error handling for the OrderForm (/checkout/confirm)
- Need to add validation to the shipping address for the order model.
- Need to add a redirect after the checkout confirm and payment processing thing is done.
- For the google account authentication make it so the token only lasts a day and then the user has to re-authenticate. I dont want to be storing super tokens in my database.
- Optimize the compilation preview process (docker worker)
  - Lazy loading of the compilation email pdfs
  - Lazy loading of the compilation page pdfs
  - Add multiple promise queues for the pdf
  - Have worker handle multiple tasks
  - ^ This means I will have to templateize the compilation pages, specifically the table of contents so they can be generated in the worker.
  - Experiment with worker container size and threads.
- Create some sort of cancel button for email filter search.
- Disallow filter searches over a certain number of results. Ask them to narrow their search.
- Need to remove the isaac part as the default value for the email filter subject.
- I think some duplicates can slip into the compilation emails. Check the select all buttons and take some other precautions to make sure that emails that are saving cant be selected and sent again.
- Something jankey when creating an imap account. Like maybe the password isnt saved/cached or somehthing. Then there is some strange behaviour when checking the connection on the edit page.
- Strange bug when previewing email. The selected eye icon disappears when the pdf loads.
- Save the compilation title and subtitle separately to populate the cover and title page with the same data

### Todo Long

- Add nginx to the build to serve static files with gzip
- See if it is possible to gzip data when streaming up to the client. It would be great to gzip the emails from searches and any pdf previews, even updated emails or pages, etc...
- Make sure that attachments are included when getting the raw emails from gmail.
- Make the date picker more intuitive. Like make sure any incomplete end date settings jump to the end of the given data. Like if only the year. go to the end of the year. If only year and month go to the end of the month. But keep the start date stuff to go to the beginning of the given data.
- Sanitize email body text before save.
- Add email confirmation to users.

### Container Notes

- The container will need to install pdftk: apt-get install pdftk

### Finished Todos

- ERROR: when entering my CC info and getting the year wrong, it wouldnt let me change and resubmit. Clicking submit again did nothing. Maybe has to do with the touch attribute of the fields.
- Need to redirect back to the /checkout page if cart or checkout info is missing when loading the /checkout/confirm page
- Make a big button to "Get started by creating an email compilation" for the dashboard if user has no compilations.
- Combine the emails page and the pages page into a compilation customization page. Call the page "Edit"
- Add loading gif to new compilation form.
- Add loading gif when populating compilation emails and pages
- Add loading gifs for dashboard lists.
- Add loading gifs to login form
- Add loading gifs to registration form
- if you switch compilations or create a new one then the compilation emails dont reset. Like you see the emails from the other compilation. The same probably happens with the pages.
- Account kind selector links need to be restyled.
- Make a compilation wrapper component to load the compilation emails, pages, page map, everything the compilation needs on fresh page and in component did mount. Maybe show loading gif until all things are loaded. Also make sure to set all compilation state related stuff to be blank while loading the new data. (This should automatically fix the issue with blank page numbers in the table of contents.)
- Need to add the correct page numbers to the bottom of the email pages.
- Load images in email previews
- Generate the finalized pdf
- Make sure registration logs you in.
- Reconnect the socket after login, registration, and logout.
- Auto redirect to dashboard after login and registration.

### Library Notes

******** CHECK THIS OUT **********
Redux form helper:
https://github.com/erikras/redux-form

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
