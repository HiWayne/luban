import { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Viewer from 'viewerjs';
import scaleIcon from '@core/images/icon-scale.png';
import 'viewerjs/dist/viewer.css';

interface ImageViewerProps {
  src: string;
  alt?: string;
  style?: object;
}

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: ${(props) => props?.style?.width || '100px'};
  height: ${(props) => props?.style?.width || '100px'};
  &:hover > span {
    opacity: 0.7;
  }
`;

const Image = styled.img`
  display: inline-block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const ViewerIcon = styled.span`
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 25px;
  height: 25px;
  background: rgba(0, 0, 0, 0.1) url(${scaleIcon}) center / 20px no-repeat;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in;
`;

const ImageViewer: FunctionComponent<ImageViewerProps> = ({ src, alt, style }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleClick = useCallback(() => {
    imageRef.current!.click();
  }, []);

  useEffect(() => {
    new Viewer(imageRef.current!);
  }, []);

  return (
    <ImageWrapper style={style}>
      <Image src={src} alt={alt || 'viewimage'} ref={imageRef} />
      <ViewerIcon onClick={handleClick} />
    </ImageWrapper>
  );
};

export default ImageViewer;
