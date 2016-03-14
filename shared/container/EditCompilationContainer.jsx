import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import CompilationFormWrapper from '../components/CompilationFormWrapper';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class EditCompilationContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.back = this.back.bind(this);
    this.checkConnection = this.checkConnection.bind(this);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.id }) || {};
  }

  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.id }) || {};
  }

  update(props) {
    this.props.dispatch(Actions.updateCompilation(this.props.params.id, {
      name: props.name,
    }));
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="edit-compilation-container">
        <Header />
        <div className="container">
          <h1>Edit Compilation</h1>
          <CompilationFormWrapper />
        </div>
      </div>
    );
  }
}

EditCompilationContainer.need = [(params, cookie) => {
  return Actions.getCompilations.bind(null, cookie)();
}];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
  };
}

EditCompilationContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditCompilationContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditCompilationContainer);
