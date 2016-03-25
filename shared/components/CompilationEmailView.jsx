import React, { PropTypes, Component } from 'react';
import * as sharedHelpers from '../helpers';

class CompilationEmailView extends Component {
  renderView() {
    const emailParts = sharedHelpers.pageEmailParts(this.props.email);

    return (<div>
      {emailParts.subject}
      {emailParts.date}
      {emailParts.from}
      {emailParts.to}
      {emailParts.body}
    </div>);
  }
  render() {
    return (
      <div>
        {this.renderView()}
        <h3>{this.props.email.subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.email.body }} />
      </div>
    );
  }
}

CompilationEmailView.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailView;
