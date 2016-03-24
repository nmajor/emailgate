import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import NewCompilationForm from '../components/NewCompilationForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class NewCompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
    this.redirectToEdit = this.redirectToEdit.bind(this);
  }

  create(props) {
    this.props.dispatch(Actions.createCompilation({
      name: props.name,
    }, this.redirectToEdit));
  }

  redirectToEdit(compilation) {
    this.context.router.push(`/compilations/${compilation._id}/emails`);
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="new-compilation-container">
        <Header />
        <div className="container">
          <h1>New Compilation</h1>
          <NewCompilationForm compilation={{}} submitForm={this.create} back={this.back} />
        </div>
      </div>
    );
  }
}

NewCompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewCompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NewCompilationContainer);
