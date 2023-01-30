import { Avatar as AntdAvatar } from 'antd';
import { DtIcon } from '@duitang/dt-react-mobile';
import { FC } from 'react';
import { UserOutlined } from '@ant-design/icons';

interface AvatarProps {
  size?: number | 'large' | 'small' | 'default';
  src?: string;
  shape?: 'circle' | 'square';
  onClick?: () => void;
}

export const Avatar: FC<AvatarProps> = ({ size, src, shape, onClick }) =>
  src ? (
    <AntdAvatar
      size={size}
      shape={shape}
      src={<DtIcon width="100%" ratio={1} src={src} noGif={false} />}
      onClick={onClick}
    />
  ) : (
    <AntdAvatar
      size={size}
      shape={shape}
      icon={<UserOutlined />}
      onClick={onClick}
    />
  );
