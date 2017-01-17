import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import PromoCodesList from '../../components/promoCodes/PromoCodesList';

class PromoCodesIndexContainer extends Component { // eslint-disable-line
  componentDidMount() {
    if (this.props.promoCodes.length < 1) {
      this.props.dispatch(Actions.getPromoCodes());
    }
  }
  renderCreateNewAction() {
    return <Link to="/promo-codes/new" className="btn btn-success" onClick={this.create}>New</Link>;
  }
  render() {
    return (<div>
      <h1>Promo Codes</h1>
      <PromoCodesList promoCodes={this.props.promoCodes} />
      {this.renderCreateNewAction()}
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
