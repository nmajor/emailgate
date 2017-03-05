import React, { PropTypes, Component } from 'react';
import ReactModal from 'react-modal';
import { colWrapperClass } from '../helpers';

class Modal extends Component {
  constructor(props, context) {
    super(props, context);

    this.bodyClass = 'unscrollable';
    this.hiddenClass = 'hidden';
  }
  componentDidMount() {
    document.body.className = `${document.body.className} ${this.bodyClass}`;
    document.querySelector('footer').className = `${document.querySelector('footer').className} ${this.hiddenClass}`;
    document.querySelector('.header').className = `${document.querySelector('.header').className} ${this.hiddenClass}`;
  }
  componentWillUnmount() {
    document.body.className = document.body.className.replace(` ${this.bodyClass}`, '');
    document.querySelector('footer').className = document.querySelector('footer').className.replace(` ${this.hiddenClass}`, '');
    document.querySelector('.header').className = document.querySelector('.header').className.replace(` ${this.hiddenClass}`, '');
  }
  renderFixedFooter() {
    if (this.props.showFixedFooter) {
      return (<div className="modal-fixed-footer">
        {this.props.renderFixedFooter()}
      </div>);
    }
  }
  renderFixedFooterAlert() {
    if (this.props.showFixedFooterAlert) {
      return (<div className="modal-fixed-footer-alert">
        {this.props.renderFixedFooterAlert()}
      </div>);
    }
  }
  renderFixedFooterClass() {
    if (this.props.showFixedFooter && this.props.showFixedFooterAlert) {
      return 'with-fixed-footer-alert';
    } else if (this.props.showFixedFooter) {
      return 'with-fixed-footer';
    }
  }
  render() {
    const styles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 20, 20, 0.75)',
      },
    };
    return (<ReactModal
      onRequestClose={this.props.close}
      isOpen
      className={`modal-content ${colWrapperClass()} ${this.renderFixedFooterClass()}`}
      style={styles}
    >
      <div className="modal-content-inner">
        {this.props.children}
      </div>
      {this.renderFixedFooterAlert()}
      {this.renderFixedFooter()}
    </ReactModal>);
  }
}

Modal.propTypes = {
  children: PropTypes.object,
  renderFixedFooter: PropTypes.func,
  renderFixedFooterAlert: PropTypes.func,
  showFixedFooter: PropTypes.bool,
  showFixedFooterAlert: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

export default Modal;
