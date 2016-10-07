import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';

class CompilationsWrapper extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.compilation = _.find(this.props.compilations, { _id: this.props.params.compilationId });
  }
  componentDidMount() {
    if (this.props.compilations.length === 0) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.compilation = _.find(nextProps.compilations, { _id: nextProps.params.compilationId });
  }
  renderChildren() {
    if (this.props.children && this.props.compilations) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { compilation: this.compilation, compilations: this.props.compilations });
      });
    }
  }
  render() {
    return <div>{this.renderChildren()}</div>;
  }
}

CompilationsWrapper.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
  };
}

CompilationsWrapper.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  compilations: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CompilationsWrapper);
