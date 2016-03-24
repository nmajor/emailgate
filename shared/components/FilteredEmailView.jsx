import React, { PropTypes, Component } from 'react';

class FilteredEmailView extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
  }

  removeEmail() {
    if (window.confirm('Are you sure you want to remove this email?')) { // eslint-disable-line no-alert
      this.props.removeEmailFromCompilation(this.props.email);
    }
  }
  renderActions() {
    if (this.props.isCompilationEmail) {
      return <div className="btn btn-danger" onClick={this.removeEmail}>Remove from compilation</div>;
    }
  }
  render() {
    return (
      <div className="compilations-list-item">
        {this.renderActions()}
        <h3>{this.props.email.subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.email.body }} />
      </div>
    );
  }
}

FilteredEmailView.propTypes = {
  email: PropTypes.object.isRequired,
  isCompilationEmail: PropTypes.bool.isRequired,
  removeEmailFromCompilation: PropTypes.func,
};

export default FilteredEmailView;
