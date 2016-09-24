import React, { PropTypes, Component } from 'react';
import ReactModal from 'react-modal';

class Modal extends Component {
  constructor(props, context) {
    super(props, context);

    this.bodyClass = 'unscrollable';
  }
  componentDidMount() {
    document.body.className = `${document.body.className} ${this.bodyClass}`;
  }
  componentWillUnmount() {
    document.body.className = document.body.className.replace(` ${this.bodyClass}`, '');
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
      content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        zIndex: '2',
      },
    };
    return (<ReactModal
      onRequestClose={this.props.close}
      isOpen
      className="col-md-6 col-md-offset-3"
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
