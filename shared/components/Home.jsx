import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';

class Home extends Component {
  render() {
    return (<div>
      <Header />
      <div className="home">
        <div className="banner">
          <div className="content col-md-6 col-md-offset-3">
            <h1>Publish your story</h1>
            <p>Filter and search your emails and publish them into a custom hardback book. Hidden in your emails is a story. Find your story. Make something you can hold, touch, and keep forever.</p>
            <Link to="/register" className="btn btn-success btn-lg btn-block">Register Now and Demo for Free!</Link>
          </div>
        </div>
        <div className="container details">
          <h1>We've made it simple and easy</h1>
          <div className="row">
            <div className="col-md-4">
              <div className="item">
                <h1>Find</h1>
                <div className="icon">
                  <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                </div>
                <p>Use our powerful filter and search tools to find and compile specific emails from one or many different email accounts.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="item">
                <h1>Tweak</h1>
                <div className="icon">
                  <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                </div>
                <p>You have full control of the content in each email. Fix any typos or remove any unwated parts or any email.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="item">
                <h1>Publish</h1>
                <div className="icon">
                  <span className="glyphicon glyphicon-book" aria-hidden="true"></span>
                </div>
                <p>No minimum order. Have one or more beautiful hardback copies of your personal email compilation shipped to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

export default Home;
