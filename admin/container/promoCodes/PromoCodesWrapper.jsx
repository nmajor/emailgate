import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';

class PromoCodesWrapper extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.promoCode = _.find(this.props.promoCodes, { _id: this.props.params.promoCodeId });
  }
  componentDidMount() {
    if (this.props.promoCodes.length === 0) {
      this.props.dispatch(Actions.getPromoCodes());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.promoCode = _.find(nextProps.promoCodes, { _id: nextProps.params.promoCodeId });
  }
  renderChildren() {
    if (this.props.children && this.props.promoCodes) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { promoCode: this.promoCode, promoCodes: this.props.promoCodes });
      });
    }
  }
  render() {
    return <div>{this.renderChildren()}</div>;
  }
}

PromoCodesWrapper.need = [
  (params, cookie) => {
    return Actions.getPromoCodes.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    promoCodes: store.promoCodes,
  };
}

PromoCodesWrapper.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  promoCodes: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(PromoCodesWrapper);
