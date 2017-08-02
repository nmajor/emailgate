import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class RegisterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }
  componentWillMount() {
    if (this.props.user.email && this.props.user.isTmp === false) {
      this.context.router.push('/dashboard');
    }
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPropertyUser('registering', undefined));
    this.props.dispatch(Actions.setPropertyUser('errors', undefined));
  }

  register(name, email, password) {
    this.props.dispatch(Actions.registerUser({ name, email, password }, this.redirectToDashboard));
  }

  redirectToDashboard() {
    this.context.router.push('/dashboard');
  }

  render() {
    return (
      <div className="register-container">
        <div className="field-bg" />
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
              <div className="user-card">
                <div className="card-body">
                  <h1>Register</h1>
                  <RegisterForm registerUser={this.register} errors={this.props.user.errors} user={this.props.user} />
                </div>
                <div className="card-footer">
                  Already have an account? <Link to="/login">Click here to login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

RegisterContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

RegisterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps)(RegisterContainer);
