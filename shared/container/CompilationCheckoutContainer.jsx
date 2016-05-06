import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class CompilationCheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;
  }

  render() {
    return (<div className="row">
      <div className="col-md-12">
        Nothing here yet ...
      </div>
    </div>);
  }
}

CompilationCheckoutContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationCheckoutContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(CompilationCheckoutContainer);
