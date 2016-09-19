import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import CompilationBuildContainer from './CompilationBuildContainer';

class ViewCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.params.emailId) {
      this.currentEmail = _.find(this.props.compilationEmails, { _id: this.props.params.emailId });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.emailId) {
      this.currentEmail = _.find(nextProps.compilationEmails, { _id: nextProps.params.emailId });
    }
  }
  render() {
    return <CompilationBuildContainer compilation={this.props.compilation} currentEmail={this.currentEmail} />;
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

ViewCompilationEmailContainer.propTypes = {
  compilationEmails: PropTypes.array.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(ViewCompilationEmailContainer);
