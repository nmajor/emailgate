import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import PromoCodesList from '../../components/promoCodes/PromoCodesList';

class PromoCodesIndexContainer extends Component { // eslint-disable-line
  componentDidMount() {
    if (this.props.promoCodes.length < 1) {
      this.props.dispatch(Actions.getPromoCodes());
    }
  }
  render() {
    return (<div>
      <h1>Promo Codes</h1>
      <PromoCodesList promoCodes={this.props.promoCodes} />
    </div>);
  }
}

PromoCodesIndexContainer.need = [
  (params, cookie) => {
    return Actions.getPromoCodes.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    promoCodes: store.promoCodes,
  };
}

PromoCodesIndexContainer.propTypes = {
  dispatch: PropTypes.func,
  promoCodes: PropTypes.array,
};

export default connect(mapStateToProps)(PromoCodesIndexContainer);
