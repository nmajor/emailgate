import React, { PropTypes, Component } from 'react';
import CompilationEmailForm from '../components/CompilationEmailForm';
// import * as Actions from '../redux/actions/index';

class CompilationEmailFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.save = this.save.bind(this);
  }

  save(props) {
    console.log('blah save compilation email form');
    console.log(props);
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
  email: PropTypes.object.isRequired,
};

export default CompilationEmailFormContainer;
