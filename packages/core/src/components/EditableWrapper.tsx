import styled, { StyledComponent } from '@emotion/styled';

interface EditableWrapperProps {
  [key: string]: any;
}

// @ts-ignore
const EditableWrapper: StyledComponent<EditableWrapperProps> = styled(({ ...props }) => {
  const showEditable = () => {};

  return <div {...props} onMouseEnter={showEditable}></div>;
})`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.6);
`;

export default EditableWrapper;
