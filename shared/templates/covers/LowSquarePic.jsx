import CoverBase from './base/CoverBase';

class LowSquarePic extends CoverBase {
  constructor(props) {
    props.showBleed = props.showBleed || true;

    super(props);

    this.props.backgroundColor = '#FFF';
    this.props.textColor = '#333';
  }
}

export default LowSquarePic;
