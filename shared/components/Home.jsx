import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component { // eslint-disable-line
  render() {
    return (<div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">myemailbook.com</a>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
            </ul>
          </div>
        </div>
      </nav>

      <div id="headerwrap">
        <div className="container">
          <div className="row">
            <h1>myemailbook.com</h1>
            <h2>You have a story in your emails. Publish it. Keep it forever.</h2>
            <br /><br />
            <Link to="/register" className="btn btn-transparent">CREATE AN ACCOUNT TO GET STARTED</Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-row">
          <div className="col-md-5 col-md-offset-1">
            <h3>WHY MIGHT YOU WANT AN EMAIL BOOK?</h3>
            <p>You know that shoebox on the top shelf of your closet where you keep all your favorite letters people have written you over the years?</p>
            <p>Probably not!</p>
            <p>People dont write letters anymore. We Facebook message, we text, we snapchat, and sometimes we even email.</p>
            <p>Most of the time those emails are meaningless. But sometimes there is something special. Sometimes there are whole threads of emails that actually mean a lot to you.</p>
            <p>There is something special and cool about physical objects. So much of our lives are digital these days. When you build and publish your email book, you are converting an part of your digital life into something physical. Something touchable. Something keepable.</p>
          </div>

          <div className="col-md-6">
            <img role="presentation" style={{ marginTop: '90px' }} className="img-responsive" src="/img/bookstack.jpg" />
          </div>

        </div>
      </div>

      <div id="gwrap">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mac">
              <img style={{ marginTop: '30px' }} src="/img/bookinhand.jpg" className="img-responsive" role="presentation" />
            </div>
            <div className="col-md-4">
              <h3>WHAT IS MYEMAILBOOK.COM?</h3>
              <p>MYEMAILBOOK.COM is a website that lets you build and publish a book from your emails.</p>
              <p>Search and filter your emails and export them into our custom email book builder.</p>
              <p>Edit, tweak and customize your emailbook, and check PDF previews so you know exactly what you are getting.</p>
              <p>Finally, we will print and publish your book on demand and ship as many as your want to your door.</p>
              <p><Link to="/register" className="btn btn-success">CREATE AN ACCOUNT TO GET STARTED</Link></p>
            </div>
          </div>
        </div>
      </div>

      <div id="blackwrap">
        <div className="container">
          <div className="row">
            <h2>FEATURES</h2>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-link"></span>
                <h4>Connect</h4>
                <p>Emails spread across multiple email accounts? No problem, connect and export from as many accounts as you need.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-search"></span>
                <h4>Find</h4>
                <p>Our filtering tools allow you to find emails by date range, subject line, sender, and receiver. So you can find all the emails you need for your emailbook.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-edit"></span>
                <h4>Edit</h4>
                <p>Notice a typo? Thing a section of one email is not important? No problem. You can edit the body of any email. After all, your email book may outlast you.</p>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-image"></span>
                <h4>Photos</h4>
                <p>Emails are more than just text these days. All photo attachments are automatically appended to the bottom of each email. </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-file"></span>
                <h4>Pages</h4>
                <p>Your email book will be more than just a bundle of emails. Add a title page, a forward, and a table of contents to give your email book that professionally published feel.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-book"></span>
                <h4>Publish</h4>
                <p>On demand printing and professional book binding. We will ship your beautiful email book right to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="gwrap">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-md-offset-4 text-center">
              <h2>PRICING</h2>
              <span className="fa fa-book price-book"></span>
              <div className="big-price">40$</div>
              <p><Link to="/register" className="btn btn-success">CREATE AN ACCOUNT TO GET STARTED</Link></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-row">
          <div style={{ textAlign: 'center' }}>&#169; myemailbook.com</div>
        </div>
      </div>

    </div>);
  }
  // render() {
  //   return (<div>
  //     <Header />
  //     <div className="home">
  //       <div className="banner">
  //         <div className="content col-md-6 col-md-offset-3">
  //           <h1>Publish your story</h1>
  //           <p>Filter and search your emails.
  // Then publish them into a custom hardback book. Find the story hidden in your emails. Make something you can hold, touch, and keep forever.</p>
  //           <Link to="/register" className="btn btn-success btn-lg btn-block">Register Now and Demo for Free!</Link>
  //         </div>
  //       </div>
  //       <div className="container details">
  //         <h1>We've made it simple and easy</h1>
  //         <div className="row">
  //           <div className="col-md-4">
  //             <div className="item">
  //               <h1>Find</h1>
  //               <div className="icon">
  //                 <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
  //               </div>
  //               <p>Use our powerful filter and search tools to find and compile specific emails from one or more email accounts.</p>
  //             </div>
  //           </div>
  //           <div className="col-md-4">
  //             <div className="item">
  //               <h1>Tweak</h1>
  //               <div className="icon">
  //                 <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
  //               </div>
  //               <p>You have full control of the content in each email. Fix any typos or remove any unwated parts of any email.</p>
  //             </div>
  //           </div>
  //           <div className="col-md-4">
  //             <div className="item">
  //               <h1>Publish</h1>
  //               <div className="icon">
  //                 <span className="glyphicon glyphicon-book" aria-hidden="true"></span>
  //               </div>
  //               <p>No minimum order. Have one or more beautiful hardback copies of your personal email compilation shipped to your door.</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>);
  // }
}

export default Home;
