import React, { PropTypes, Component } from 'react';
import CompilationTitleForm from '../components/CompilationTitleForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationTitleContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.update = this.update.bind(this);
    // this.addImage = this.addImage.bind(this);
  }
  update(props) {
    this.props.dispatch(Actions.updateCompilationFetch(this.props.compilation._id, props, () => {}));
  }
  // addImage(props) {
  //   this.props.dispatch(Actions.addCompilationImage(this.props.compilation._id, props, () => {}));
  // }
  render() {
    return (<div className="container compilation-container">
      <div className="compilation-content-box">
        <h1 className="text-center">Design Cover</h1>
        <CompilationTitleForm compilation={this.props.compilation} submitForm={this.update} fetching={this.props.compilation.saving} />
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    compilationEmails: store.compilationEmails,
  };
}

CompilationTitleContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationTitleContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
  compilationEmails: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationTitleContainer);
