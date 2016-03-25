import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import EmailView from './EmailView';
import _ from 'lodash';

class FilteredEmailView extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
    this.addEmail = this.addEmail.bind(this);
  }

  removeEmail() {
    if (window.confirm('Are you sure you want to remove this email?')) { // eslint-disable-line no-alert
      this.props.removeEmailFromCompilation(this.props.email);
    }
  }
  addEmail() {
    this.props.addEmailToCompilation(this.props.email);
  }
  renderActions() {
    if (this.props.compilationEmail) {
      return (<div>
        <Link
          className="btn btn-primary bottom-bumper right-bumper"
          to={`/compilations/${this.props.compilation._id}/emails/${this.props.compilationEmail._id}`}
        >View in compilation</Link>
        <div className="btn btn-danger bottom-bumper" onClick={this.removeEmail}>Remove from compilation</div>
      </div>);
    } else if (this.props.email) {
      if (this.props.email.saving) {
        return 'Saving ...';
      }

      return (<div>
        <div className="btn btn-success bottom-bumper" onClick={this.addEmail}>Add to compilation</div>
      </div>);
    }
  }
  renderView() {
    if (!_.isEmpty(this.props.email)) {
      return <EmailView email={this.props.email} />;
    }
  }
  render() {
    return (
      <div className="compilations-list-item">
        {this.renderActions()}
        {this.renderView()}
      </div>
    );
  }
}

FilteredEmailView.propTypes = {
  email: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmail: PropTypes.object,
  removeEmailFromCompilation: PropTypes.func,
  addEmailToCompilation: PropTypes.func,
};

export default FilteredEmailView;
