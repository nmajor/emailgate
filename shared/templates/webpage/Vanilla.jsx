import React from 'react';
// import _ from 'lodash';
import { renderToString } from 'react-dom/server';
// import moment from 'moment';
// import fonts from './covers/utils/fonts';

class TitlePageTemplate {
  constructor(props) {
    this.props = props;
    this.props.compilation.webpage = this.props.compilation.webpage || {};
  }
  renderCss() {
    return <style dangerouslySetInnerHTML={{ __html: css }} />;
  }
  renderImage() {
    const { compilation } = this.props;
    const image = compilation.webpage.image || {};
    const crop = compilation.webpage.imageCrop || {};
    console.log('blah', crop);

    const resize = 0.6;

    return (<div
      style={{
        width: `${crop.w * resize}px`,
        height: `${crop.h * resize}px`,
        overflow: 'hidden',
        borderRadius: '50%',
      }}
    >
      <img
        style={{
          position: 'relative',
          top: `-${crop.y * resize}px`,
          left: `-${crop.x * resize}px`,
          width: `${crop.naturalWidth * crop.scale * resize}px`,
        }} role="presentation" src={image.url}
      />
    </div>);
  }
  renderPostcardBack() {
    return (<div className="van-postcard-back van-postcard-aspect-wrapper">
      <div className="van-postcard-aspect-main">
        Back
      </div>
    </div>);
  }
  renderPostcardFront() {
    return (<div className="van-postcard-front van-postcard-aspect-wrapper">
      <div className="van-postcard-aspect-main">
        Front
      </div>
    </div>);
  }
  render() {
    const { compilation } = this.props;

    return (<div className="van-main">
      <div className="container-fluid van-profile-container">
        {this.renderCss()}
        <div className="row van-wrapper">
          <div className="col-md-12 van-centered">
            <div className="van-profile-box">
              {this.renderImage()}
              <h3>{compilation.webpage.title}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container van-postcard-container">
        <div className="row van-wrapper">
          <div className="col-md-12 van-centered">
            <div className="van-postcard-box">
              {this.renderPostcardBack()}
              {this.renderPostcardFront()}
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
  toString() {
    return renderToString(this.render());
  }
}

const css = `
.van-profile-container {
  background: url("https://source.unsplash.com/Besxfn2Z8fo") no-repeat center center fixed;
  background-size: cover;
}
.van-main {
  background-color: #eee;
}
.van-profile-box {
  background-color: rgba(33, 33, 33, 0.7);
  color: #eee;
  padding: 30px;
  border-radius: 5px;
}
.van-postcard-box {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 30px;
}
.van-postcard-aspect-wrapper {
  width: 100%;
  /* whatever width you want */
  display: inline-block;
  position: relative;
}
.van-postcard-aspect-wrapper:after {
  padding-top: 66.67%;
  /* 16:9 ratio */
  display: block;
  content: '';
}
.van-postcard-aspect-main {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  /* fill parent */
  background-color: deepskyblue;
  /* let's see it! */
  color: white;
}
.van-wrapper {
  margin: 50px;
}
.van-centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

export default TitlePageTemplate;
