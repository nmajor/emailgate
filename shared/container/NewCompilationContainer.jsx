import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import { colWrapperClass } from '../helpers';

class NewCompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
  }

  create(props) {
    this.props.dispatch(Actions.createCompilation(props, (compilation) => {
      this.context.router.push(`/compilations/${compilation._id}/build`);
    }));
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
              <h1>New Email Book</h1>
              <CompilationTitleForm compilation={{}} submitForm={this.create} back={this.back} fetching={this.props.fetching.newCompilation} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
  };
}

NewCompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewCompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(NewCompilationContainer);
