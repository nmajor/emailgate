import React, { PropTypes, Component } from 'react';
import CompilationEmailForm from '../components/CompilationEmailForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationEmailFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.save = this.save.bind(this);
  }

  save(emailProps) {
    this.props.dispatch(Actions.updateCompilationEmail(this.props.compilation._id, this.props.email, emailProps));
  }

  render() {
    return (
      <div>
        <CompilationEmailForm
          email={this.props.email}
          submitForm={this.save}
        />
      </div>
    );
  }
}


CompilationEmailFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  email: PropTypes.object.isRequired,
};

export default connect()(CompilationEmailFormContainer);
