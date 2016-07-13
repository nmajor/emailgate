import React, { Component } from 'react';
// import { Link } from 'react-router';

class Home extends Component { // eslint-disable-line
  render() {
    return (<div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">My Email Book</a>
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
            <h1>My Email Book</h1>
            <h2>Print your digital story</h2>
            <br /><br />
            <a href="#" className="btn btn-success">LEARN MORE</a>
            <a href="#" className="btn btn-transparent">GET STARTED</a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-row">
          <div className="col-md-4 col-md-offset-2">
            <h3>HOW DOES IT WORK?</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>

          <div className="col-md-4">
            <img role="presentation" style={{ marginTop: '80px' }} className="img-responsive" src="/img/bookstack.jpg" />
          </div>

        </div>
      </div>

      <div id="gwrap">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mac">
              <img src="/img/bookinhand.jpg" className="img-responsive" role="presentation" />
            </div>
            <div className="col-md-4">
              <h3>IMPORTANT STUFF HERE</h3>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
              <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p><a href="#" className="btn btn-success">PURCHASE NOW</a></p>
            </div>
          </div>
        </div>
      </div>

      <div id="blackwrap">
        <div className="container">
          <div className="row">
            <h2>OUR FEATURES</h2>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-calendar"></span>
                <h4>Feature one</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-cloud"></span>
                <h4>Feature two</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-database"></span>
                <h4>Feature three</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-cubes"></span>
                <h4>Feature four</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-folder"></span>
                <h4>Feature five</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="block">
                <span className="fa fa-suitcase"></span>
                <h4>Feature six</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="gwrap">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-md-offset-2">
              <img className="img-responsive" src="/img/bookpile.jpg" role="presentation" />
            </div>
            <div className="col-md-4">
              <h3>IMPORTANT STUFF HERE</h3>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
              <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
              <p><a href="#" className="btn btn-success">PURCHASE NOW</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-row">
          <h3 style="text-align:center">TRY US NOW</h3>
          <br />
          <div className="col-md-6 col-md-offset-3">
            <form role="form" action="register.php" method="post">
              <input type="email" name="email" className="subscribe-input" placeholder="Enter your e-mail address..." required />
              <button className="btn btn-submit subscribe-submit" type="submit">Subscribe</button>
            </form>

          </div>
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
