import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
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
    if (this.props.user.email) {
      this.context.router.push(`/dashboard`);
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
    this.context.router.push(`/dashboard`);
  }

  render() {
    return (
      <div className="login-container">
        <Header />
        <RegisterForm registerUser={this.register} errors={this.props.user.errors} user={this.props.user} />
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
