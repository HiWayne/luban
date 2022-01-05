import { FunctionComponent } from 'react';
import { ColumnNames } from '@core/types/types';
import { definePropertyOfName } from '@core/utils/index';
import { ImageViewer } from '@core/components/index';

interface SingleImageProps {
  data: string;
}

const SingleImage: FunctionComponent<SingleImageProps> = ({ data }) => {
  if (typeof data === 'string') {
    return <ImageViewer src={data} alt="single_image"></ImageViewer>;
  } else {
    console.error(`data of props should be string, but got "${typeof data}" in column singleImage`);
    return null;
  }
};

definePropertyOfName(SingleImage, ColumnNames.SINGLE_IMAGE);

export default SingleImage;
