TOP TODOS:
- Cropping issue, when you dont touch the cropping area after upload it gets really small
 - also for full size image for the full size image
- Its possible for blogger blogs to not connect at all (maybe due to finding the rss feed, maybe add a redo on that if anything fails)
- Still having a checkout issue with some customers
- Build the voucher promo code feature
- build a webhook for woocommerce
- Change the text for "Add custom page here" - make it bigger


Before thanksgiving:
Prebuy
Get some user feedback regarding bugs ()
Design christmas ad

FROM BJ:
- Make the Table of Contents font smaller
- Greyify date and photo icon line in Table of Contents

STRETCH:
- Custom page with any text
- Quote page
- New Cover Designs

DONE:
- Add a banner for unsaved compilations with a link to the login modal
- Add 2 more covers
- Get the thumbnail working for the new cover
- Autoselect the currently selected image when re-opening the image selector
- Persist the crop location when re-opening the image selector
- Add a loader when images are uploading
- Also when the existing images are downloading to the page have some default width and background for the image elements
- New domain with SSL
- Make Add Emails socket event add emails 1 by 1 instead of Promise.all
- Email preview and edit font needs to be bigger when viewing on website
- Estimated page number
- Add EXPAND down arrow icon to collapsed emails
- Change icons to words (EDIT, SAVE, VIEW)
- Add progress bar on top (Add Emails -> Edit Book (50 emails) -> Checkout)
- Remove modal for add emails - Move to add emails progress step
- Remove modal for checkout - Move to checkout progress step
- When adding emails grey out pending emails and show progress (Adding 50 emails) in a notification strip below the navbar
- Cover templates change to icons (thumbnails)

MAYBE NOT THAT IMPORTANT OR CHANGED MY MIND:
- Move search to a sidebar (See how it works)
- Grey out emails when saving



COVER IDEAS:
https://www.google.pt/search?q=notebook+design&espv=2&biw=1337&bih=780&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiAlcHDib_RAhUGj1QKHWE3AYAQ_AUIBigB#imgrc=Qn7g5UwYodBOUM%3A

Pixels to MM:
  pixels = (mm * dpi) / 25.4
MM to Pixels:
  mm = (pixels * 25.4) / dpi
Source: http://www.dallinjones.com/2008/07/how-to-convert-from-pixels-to-millimeters/


subject:isaac after:2013/5/1 before:2013/6/1





UX Notes:
- Next step buttons always in the right of the footer
- Extra actions on the left
- Add the save email button into the header icons and remove it from the fixed footer
- Add a fixed footer to the modal
  - Show how many emails have already been added
  - Put the add checked emails button there and the done button there
- Add a close button to the modal
- Add an edit link in the Cart page inline with the cart items
- Add a new book button to the left side of the action section
- Prompt before removing a cart item
- Make 1 the minimum quantity for cart items
- If you have no addresses show an address form automatically
- Tell how long it will take to ship in the checkout process


Home page
Up to 1000 pages full color
only $59
Thats X cents per page!






PDF.js cors:

Setting custom header for the request.
https://groups.google.com/forum/#!topic/mozilla.dev.pdf-js/iDUqbjMRcGc


docker run -it --rm -v /Users/nmajor/tmp:/tmp ubuntu:trusty /bin/bash

-v /Users/nmajor/dev/contracts/Flvid:/var/www

### TOP TODOS:
- Rebuild a mini cart thing to display on the compilation checkout page instead of the full cart.
- On the preview page, check for any components with a missing or undefined pdf object.
  - Make a request to get those pdfs.
  - Maybe show a loading gif that important things are happening.
  - Probably disable the approve button until it is finished
  - Maybe do some long polling to keep checking until they are all up to date.

### Other Todos:

- Add email confirmation to users.
- Make the date picker more intuitive. Like make sure any incomplete end date settings jump to the end of the given data. Like if only the year. go to the end of the year. If only year and month go to the end of the month. But keep the start date stuff to go to the beginning of the given data.
- Something jankey when creating an imap account. Like maybe the password isnt saved/cached or somehthing. Then there is some strange behaviour when checking the connection on the edit page.

### Finished Todos

- Load the price of the compilation on the home page from the product.json
- Need to add the compilation name to the cart item description
- See if it is possible to gzip data when streaming up to the client. It would be great to gzip the emails from searches and any pdf previews, even updated emails or pages, etc...
- Need to add validation to the shipping address for the order model.
- Make sure that attachments are included when getting the raw emails from gmail.
- Optimize the gmail api integration.
  - If the query would grab more than 300 emails, ask the user to refine the search.
  - Make it so that redoing the search cancels the previous task.
- Need to remove the Isaac part as the default value for the email filter subject.
- I think some duplicates can slip into the compilation emails. Check the select all buttons and take some other precautions to make sure that emails that are saving cant be selected and sent again.
- Error handling for the OrderForm (/checkout/confirm)
- Add nginx to the build to serve static files with gzip
- Need to add a redirect after the checkout confirm and payment processing thing is done.
- Sanitize email body text before save.
- The prod env is not bulding the css. The css is being loaded through the javascript. Maybe need to add a conditional when including the css file in client/index.js
- Let user know when compilation PDF job is queued and waiting for stuff. Maybe make it so that queuing a compilation pdf waits until the emails and pages jobs are complete before adding the compilation-pdf job to the queue. You could attach to the redis pubsub to watch it. That way you could give more accurate progress to the user by showing how many other email and pdf stuff is left. It also solves the problems that compilation-pdf has when it is at a lower priority than the email and page pdf jobs.
- Check position in queue for watched jobs.
- Monitor and update email and page pdf jobs and push up completed pdf objects to the client after jobs are done. Client should be updated throughout the process.
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

devDependencies
"react-addons-test-utils": "^0.14.7",


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


**** Maybe a better lib for pdf generation
- http://wkhtmltopdf.org/

- http://forums.debian.net/viewtopic.php?t=30598 - How to add page numbers to a pdf with pdftk
- http://stackoverflow.com/questions/1603301/how-to-add-page-numbers-to-postscript-pdf - Good stackoverflow thread with good options for adding pages to a pdf

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

### Subdocument duplicate key error:
 - http://stackoverflow.com/questions/13439102/duplicate-key-error-index-on-embedded-document-in-mongoose
> db.purchaseorders.getIndexes()
> db.purchaseorders.dropIndex('responses._id_1')


### Facebook Pixel Events:
PageView when page changes
CompleteRegistration on registerUser action
InitiateCheckout when user clicked checkout page when viewing the cart
AddToCart on addCartItem action
Lead on createCompilation action
Search on getFilteredAccountEmails action
Purchase on createOrder action
ConnectAccount when user clicks button to connect a gmail account
AddEmails on addEmailsToCompilationEmails

### Started books:
Joseph Higgins - higgjose@hotmail.com - August 3rd
Susie Stroud - susie.bryan@sbcglobal.net - August 2nd
Ann Bailey - baileybunch6@gmail.com - June 21st
Suzee Anderson - suzeesews@gmail.com - June 14th
Julie Wolf - juliewolff5@gmail.com - June 1
Tanya Bowerbank - rbowerbank@digis.net - May 31
Alicia Waterlyn - ah2olyn@msn.com - May 31
Jordan Wouden - jekins1@gmail.com - May 28
Letitia Powell - letitiapowell@gmail.com - May 25
Gayla - gayla@lakemtn.com - May 25

New Sessions

Page Views
Visitors
Compilations Created
Compilations Edited
Tmp Users Created
Users Created

--- Email Account bug

[TypeError: Cannot read property 'token' of undefined]
TypeError: Cannot read property 'token' of undefined
    at /var/app/server/util/googleAuth.js:158:30
    at new wrappedPromise (/tmp/node_modules/newrelic/lib/instrumentation/promise.js:156:20)
    at Object.searchMessages (/var/app/server/util/googleAuth.js:157:10)
    at model.googlefilteredEmails (/var/app/server/models/account.js:151:21)
    at model.filteredEmails (/var/app/server/models/account.js:126:17)
    at /var/app/server/events/index.js:90:24
    at wrapped (/tmp/node_modules/newrelic/lib/transaction/tracer/index.js:184:28)
    at Promise.linkTransaction (/tmp/node_modules/newrelic/lib/instrumentation/promise.js:295:65)
    at Promise.wrapped (/tmp/node_modules/newrelic/lib/transaction/tracer/index.js:184:28)
    at __NR_wrappedThenHandler (/tmp/node_modules/newrelic/lib/instrumentation/promise.js:471:26)
    at run (/tmp/node_modules/babel-polyfill/node_modules/core-js/modules/es6.promise.js:66:22)
    at /tmp/node_modules/babel-polyfill/node_modules/core-js/modules/es6.promise.js:79:30
    at flush (/tmp/node_modules/babel-polyfill/node_modules/core-js/modules/_microtask.js:18:9)
    at nextTickCallbackWith0Args (node.js:419:9)
    at process._tickDomainCallback [as _tickCallback] (node.js:389:13)
