import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import PostcardBack from '../components/PostcardBack';

class BuildPostcardFrontContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    //              width / height
    this.aspectRatio = (6 / 4);
    this.state = {
      previewElmWidth: null,
    };
  }
  componentDidMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize, true);
    setTimeout(() => { this.handleWindowResize(); }, 100);
    setTimeout(() => { this.handleWindowResize(); }, 100);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, true);
  }
  getPreviewHeight() {
    if (this.state.previewElmWidth) {
      return (1 / this.aspectRatio) * this.state.previewElmWidth;
    }

    return 20;
  }
  handleWindowResize() {
    this.setState({ previewElmWidth: this.refs['postcard-back-preview'].offsetWidth });
  }
  handleTextChange(event) {
    const text = event.target.value;
    this.props.dispatch(Actions.setPostcardProps({ backText: text }));
  }
  render() {
    // const { compilation } = this.props;
    const postcardHeight = this.getPreviewHeight();
    return (<div className="row">
      <div className="col-sm-6">
        <textarea className="back-text" onChange={this.handleTextChange} value={this.props.postcard.backText} />
      </div>
      <div className="col-sm-6">
        <div ref="postcard-back-preview" className="postcard-back-preview">
          <PostcardBack
            height={postcardHeight || 0}
            width={this.state.previewElmWidth || 0}
            units="px"
            content={this.props.postcard.backText || ''}
          />
        </div>
      </div>
    </div>);

    // return ();
  }
}

function mapStateToProps(store) {
  return {
    postcard: store.postcard,
  };
}

BuildPostcardFrontContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  postcard: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BuildPostcardFrontContainer);
