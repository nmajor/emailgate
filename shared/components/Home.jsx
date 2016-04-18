import React, { Component } from 'react';
// import { Link } from 'react-router';
import Header from '../components/Header';

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
          <div className="home container">
            <div className="row">
              <div classNam="col-md-12">
                <h1>Home Page</h1>
                <div>Login or Register to begin ...</div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Home;
