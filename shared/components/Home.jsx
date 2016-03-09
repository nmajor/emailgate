import React, { Component } from 'react';
// import { Link } from 'react-router';
import Header from '../components/Header';

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="home">
          <div className="home-content">
            <h1 className="home-title">
              Home Page 2
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
