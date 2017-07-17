/* eslint react/prop-types: 0 */
/* eslint no-useless-constructor: 0 */
/* eslint react/jsx-first-prop-new-line: 0 */
/* eslint react/jsx-closing-bracket-location: 0 */

import React from 'react';
import CoverBase from './base/CoverBase';
import FrontCoverBase from './base/FrontCoverBase';
import CoverImage from './utils/CoverImage';
import fonts from './utils/fonts';

class LowSquarePic extends CoverBase {
  constructor(props) {
    props.showBleed = props.showBleed || true;

    super(props);

    this.props.backgroundColor = '#fdfcf9';
    this.props.textColor = '#333';
    this.props.primaryFont = fonts.quicksand;
    this.props.secondaryFont = fonts.lato;
  }
  renderFrontCover() {
    const {
      compilation,
      prettyStartDate,
      prettyEndDate,
      // boardHeightPx,
      boardWidthPx,
      selectImage,
      secondaryFont,
      primaryFont,
    } = this.props;

    const aspect = (5 / 6);

    const defaultImage = {
      url: '/img/cover-images/sister-on-pink.jpg',
      crop: {
        height: 813,
        naturalHeight: 945,
        naturalWidth: 900,
        width: 731,
        x: 73,
        y: 132,
      },
    };

    const coverProps = {
      aspect,
      key: 'high-border-pic-front',
      defaultImage,
    };

    const contentPad = 20;
    const contentWidth = boardWidthPx - (contentPad * 2);
    const imageWidth = contentWidth;
    const imageHeight = imageWidth * (1 / aspect);
    // Have to flip the aspect ratio because we want the longer length to be the
    // height and aspect ratios always have the width as the first number

    return (<FrontCoverBase {...this.props}>
      <div style={{
        position: 'absolute',
        top: contentPad,
        left: contentPad,
        height: imageHeight,
        width: imageWidth,
      }}>
        <CoverImage
          height={imageHeight}
          width={imageWidth}
          selectImage={selectImage}
          coverProps={coverProps}
          compilation={compilation}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: imageHeight + (contentPad + 10),
        left: contentPad,
        width: `${contentWidth}px`,
        textAlign: 'left',
        height: '115px',
        fontSize: '45px',
        fontWeight: '200',
        fontFamily: primaryFont.family,
        lineHeight: '50px',
      }}>
        <span>{compilation.title}</span>
      </div>
      <div style={{
        position: 'absolute',
        bottom: contentPad,
        left: contentPad,
        width: `${contentWidth}px`,
        textAlign: 'right',
        fontWeight: '400',
        fontFamily: secondaryFont.family,
      }}>
        <div style={{
          fontSize: '12px',
        }}>{compilation.subtitle}</div>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
        }}>{prettyStartDate} - {prettyEndDate}</div>
      </div>
    </FrontCoverBase>);
  }
}

export default LowSquarePic;
