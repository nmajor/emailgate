import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class LoginContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }
  componentWillMount() {
    if (this.props.user.email && this.props.user.isTmp === false) {
      this.context.router.push('/dashboard');
    }
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPropertyUser('loggingIn', undefined));
    this.props.dispatch(Actions.setPropertyUser('errors', undefined));
  }

  login(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }, this.redirectToDashboard));
  }

  redirectToDashboard() {
    this.context.router.push('/dashboard');
  }

  render() {
    return (<div className="login-container">
      <div className="field-bg" />
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div className="user-card">
              <div className="card-body">
                <h1>Login</h1>
                <LoginForm loginUser={this.login} errors={this.props.user.errors} user={this.props.user} />
              </div>
              <div className="card-footer">
                Dont have an account? <Link to="/register">Sign up for free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

LoginContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

LoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(LoginContainer);
