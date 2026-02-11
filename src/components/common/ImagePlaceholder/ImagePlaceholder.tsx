import * as React from 'react';
import { ImagePlaceholdeStyles } from 'src/components/common/ImagePlaceholder/ImagePlaceholde.styles.ts';

type ImagePlaceholderProps = {
  style?: React.CSSProperties;
};

const ImagePlaceholder = ({ style }: ImagePlaceholderProps) => (
  <ImagePlaceholdeStyles style={style} />
);

export default ImagePlaceholder;
