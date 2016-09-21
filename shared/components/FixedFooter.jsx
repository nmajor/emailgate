import React, { PropTypes, Component } from 'react';

class FixedFooter extends Component { // eslint-disable-line
  render() {
    return (<div className="fixed-footer container">
      <div className="row">
        <div className="col-sm-6 col-md-offset-3">
          <div className="col-md-12">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>);
  }
}

FixedFooter.propTypes = {
  children: PropTypes.array.isRequired,
};

export default FixedFooter;
