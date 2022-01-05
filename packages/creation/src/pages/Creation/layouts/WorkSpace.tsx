import { FunctionComponent } from 'react';

interface WorkSpaceProps {}

const WorkSpace: FunctionComponent<WorkSpaceProps> = ({ ...props }) => (
  <section
    style={{
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flex: '1',
      width: '100vw',
      overflow: 'hidden',
    }}
    {...props}
  ></section>
);

export default WorkSpace;
