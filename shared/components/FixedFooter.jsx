import React, { PropTypes, Component } from 'react';

class FixedFooter extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.withFixedClass = 'with-fixed';
  }
  componentDidMount() {
    document.body.className = `${document.body.className} ${this.withFixedClass}`;
    document.querySelector('footer').className = `${document.querySelector('footer').className} ${this.withFixedClass}`;
  }
  componentWillUnmount() {
    document.body.className = document.body.className.replace(` ${this.withFixedClass}`, '');
    document.querySelector('footer').className = document.querySelector('footer').className.replace(` ${this.withFixedClass}`, '');
  }
  render() {
    return (<div className="fixed-footer container">
      <div className="row">
        <div className="col-md-12">
          <div className="col-md-12">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>);
  }
}

FixedFooter.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FixedFooter;
