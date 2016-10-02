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
      className={`modal-content ${colWrapperClass()}`}
      style={styles}
    >
      {this.props.children}
    </ReactModal>);
  }
}

Modal.propTypes = {
  children: PropTypes.object,
  close: PropTypes.func.isRequired,
};

export default Modal;
