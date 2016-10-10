import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CompilationBuildContainer from './CompilationBuildContainer';
import Modal from '../components/Modal';
import LoginForm from '../components/LoginForm';

class CompilationRegisterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.login = this.login.bind(this);
    this.back = this.back.bind(this);
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setPropertyUser('loggingIn', undefined));
    this.props.dispatch(Actions.setPropertyUser('errors', undefined));
  }
  back() {
    if (this.props.params.next === 'post') {
      return this.context.router.push(`/compilations/${this.props.compilation._id}/post-next`);
    }

    return this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  login(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }, this.back));
  }
  renderRegisterLink() {
    let link = `/compilations/${this.props.compilation._id}/build/register`;
    if (this.props.params.next === 'post') {
      link += '/post';
    }
    return <Link to={link}>Dont have an account? Click here to make one.</Link>;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div>
          <h3>Login here and we will connect this Email Book to your account.</h3>
          <LoginForm loginUser={this.login} errors={this.props.user.errors} user={this.props.user} />
          {this.renderRegisterLink()}
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

CompilationRegisterContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationRegisterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationRegisterContainer);
