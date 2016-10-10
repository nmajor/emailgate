import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import { colWrapperClass } from '../helpers';
import _ from 'lodash';

class NewCompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.createCompilation = this.createCompilation.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.back = this.back.bind(this);
  }

  createCompilation(props) {
    this.props.dispatch(Actions.createCompilation(props, (compilation) => {
      this.context.router.push(`/compilations/${compilation._id}/pre-next`);
    }));
  }
  submitForm(props) {
    if (_.isEmpty(this.props.user)) {
      this.props.dispatch(Actions.registerTmpUser(() => {
        this.createCompilation(props);
      }));
    } else {
      this.createCompilation(props);
    }
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="new-compilation-container">
        <Header />
        <div className="container">
          <div className="row">
            <div className={colWrapperClass()}>
              <h3>Add a title to get started</h3>
              <CompilationTitleForm compilation={{}} submitForm={this.submitForm} fetching={this.props.fetching.newCompilation} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    fetching: store.fetching,
  };
}

NewCompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewCompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(NewCompilationContainer);
