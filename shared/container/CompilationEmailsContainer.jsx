import React, { PropTypes, Component } from 'react';
import CompilationEmailsListContainer from './CompilationEmailsListContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import { Link } from 'react-router';

class CompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.removeEmail = this.removeEmail.bind(this);
    this.compilation = this.props.compilation;
    this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
  }

  removeEmail() {
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.compilation._id, this.currentEmail));
  }
  renderAddLink() {
    return (<Link
      className="btn btn-success btn-block bottom-bumper"
      to={`/compilations/${this.compilation._id}/add-emails`}
    >
      Add Emails
    </Link>);
  }
  renderChildren() {
    if (this.props.children) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation, currentEmail: this.currentEmail });
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Compilation Emails ({this.props.compilationEmails.length})</h1>
        <div className="row">
          <div className="col-md-3">
            {this.renderAddLink()}
            <CompilationEmailsListContainer currentEmailId={this.props.params.emailId} compilation={this.compilation} />
          </div>
          <div className="col-md-9">
            { this.renderChildren() }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

CompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationEmailsContainer);
