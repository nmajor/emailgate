import React, { PropTypes, Component } from 'react';

class FilteredEmailPreview extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
  }

  removeEmail() {
    this.props.removeEmailFromCompilation(this.props.email);
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
        <p>{this.props.email.text}</p>
      </div>
    );
  }
}

FilteredEmailPreview.propTypes = {
  email: PropTypes.object.isRequired,
  isCompilationEmail: PropTypes.bool.isRequired,
  removeEmailFromCompilation: PropTypes.func,
};

export default FilteredEmailPreview;
