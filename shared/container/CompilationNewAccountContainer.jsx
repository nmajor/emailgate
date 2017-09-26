import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import HelperBox from '../components/HelperBox';
import * as Actions from '../redux/actions/index';

class CompilationNewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.back = this.back.bind(this);
    this.create = this.create.bind(this);
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  create(props) {
    return new Promise((resolve, reject) => {
      if (props.kind === 'blog') {
        this.props.dispatch(Actions.createAccount({
          email: props.url,
          kind: props.kind,
        }, (response) => {
          if (response.error) {
            reject({ _error: response.error });
          } else {
            resolve();
            this.context.router.push(`/compilations/${this.props.compilation._id}/add-emails`);
          }
        }));
      }
    });
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/add-emails`;
  }
  renderHelperBox() {
    const body = (<span>You can remove Missionary Memoir's access to your emails at any time by deleting the email account in your dashboard. We will never use your data for any other purpose than to build your email book. For more info you can read our site <Link to="/terms">terms of use</Link>, or our <Link to="/privacy">privacy policy</Link>.</span>);
    return <HelperBox type="warning" body={body} />;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div className="padded">
          <h2 className="marginless-top text-center">Connect an Account</h2>
          <h3 className="marginless-top text-center bottom-bumper">Where would you like to add emails from?</h3>
          {this.renderHelperBox()}
          <AccountFormContainer new account={{}} submitForm={this.create} back={this.back} userReturnTo={this.userReturnTo()} />
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
  };
}

CompilationNewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationNewAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationNewAccountContainer);
