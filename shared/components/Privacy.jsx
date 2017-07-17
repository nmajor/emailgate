import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Privacy() {
  /* eslint-disable */

  const terms = `PRIVACY STATEMENT

----

SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?

When you use our email book builder website and order an email book, as part of the building, printing, shipping process, we collect the personal information you give us such as your name, address and email address.

We may ask you to give us access to your gmail account, or other email accounts, so we can help you compile the emails you want to be included in your email books.

When you use our website, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.

Email marketing: With your permission, we may send you emails about our store, new products and other updates.


SECTION 2 - CONSENT

How do you get my consent?

When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.

When you connect your gmail account to our app, or allow us to access your other email accounts through IMAP, we imply that you consent to us searching and collecting your emails in order to build an email book, and for that specific reason only.

If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.


How do I withdraw my consent?

If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at hello@missionarymemoir.com


SECTION 3 - DISCLOSURE

We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.


SECTION 4 - USAGE

We never store any Credit Card data, email passwords on our servers. All other data is stored on a secure server behind a firewall.

All data and information we do collect is for the sole purpase of helping you build, purchse, and receive your email books. The email data, book data, and shipping information we collect is compiled into pdf form and sent to our printing service.

We will not sell or distribute any of your emails, personal info, or browsing info to anyone else, nor will we use any info or data we collect for any purpose other then the purpose stated above.

If you produce a particularly cool book, we may contact you about using your book in our marketing material but we will only do so with your permission.

Payment:

If you choose to purchase something from our website, your transaction will be handled through Stripe. Please see their privacy policy for

If you choose to purchase something on our website, then we send your Credit Card data to stripe.

For more insight, you may also want to read Stripe’s Terms of Service here or Privacy Statement <a href="https://stripe.com/us/privacy">here</a>.


SECTION 5 - THIRD-PARTY SERVICES


In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.

However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.

For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.

In particular, remember that certain providers may be located in or have facilities that are located in a different jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.

As an example, if you are located in Canada and your transaction is processed by a payment gateway located in the United States, then your personal information used in completing that transaction may be subject to disclosure under United States legislation, including the Patriot Act.

Once you leave our store’s website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website’s Terms of Service.


Links

When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.


SECTION 6 - SECURITY

To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.

If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with a AES-256 encryption.  Although no method of transmission over the Internet or electronic storage is 100% secure, we follow all PCI-DSS requirements and implement additional generally accepted industry standards.


COOKIES

Here is a list of cookies that we use. We’ve listed them here so you can choose if you want to opt-out of cookies or not.

connect.sid, session cookie. This is how we keep you logged in so you dont have to sign in each time you come to the site. This allows us to store information about your session (referrer, landing page, etc).

io, this is a different type of session cookie, and is used for sending updates to your browser when something changes on the server.

We also use the following services that may also include cookies when browsing our website:

Google Analytics: For traffic and behaviour analytics which we use to make your browsing experience better.

Tawk.io: This is a support chat service so we can assist our users should they require some customer or technical support

Stripe: This is our payment provider.


SECTION 7 - AGE OF CONSENT

By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.


SECTION 8 - CHANGES TO THIS PRIVACY POLICY

We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.

If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.

QUESTIONS AND CONTACT INFORMATION

If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at hello@missionarymemoir.com

----

`.replace(/(?:\r\n|\r|\n)/g, '<br />');

return (<div>
  <Header />
  <div className="container">
    <h1>Privacy Policy</h1>
    <div dangerouslySetInnerHTML={{ __html: terms }}></div>
  </div>
  <Footer />
  </div>);
  /* eslint-enable */
}

export default Privacy;
