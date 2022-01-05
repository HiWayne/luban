import { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { ColumnNames } from '@core/types/types';
import { definePropertyOfName } from '@core/utils/index';
import { ImageViewer } from '@core/components/index';

interface MultiImagesWrapperProps {
  data: string[];
}

const MultiImagesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(auto-fill, auto);
  gap: 5px;
  width: 200px;
`;

const MultiImages: FunctionComponent<MultiImagesWrapperProps> = ({ data }) => {
  if (Array.isArray(data)) {
    return (
      <MultiImagesWrapper>
        {data.map((src) => (
          <ImageViewer key={src} src={src} alt="single_image" style={{ width: '65px' }}></ImageViewer>
        ))}
      </MultiImagesWrapper>
    );
  } else {
    console.error(`data of props should be array, but got "${typeof data}" in column multiImages`);
    return null;
  }
};

definePropertyOfName(MultiImages, ColumnNames.MULTI_IMAGES);

export default MultiImages;
