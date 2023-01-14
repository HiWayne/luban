import { FC, useEffect, useState } from 'react';
import { message, Input, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadImage } from '@duitang/dt-base';
import { Flex } from '@/frontend/components';

interface UploadImageConfigProps {
  defaultUrl?: string;
  onChange: (image: string) => void;
}

export const UploadImageConfig: FC<UploadImageConfigProps> = ({
  defaultUrl,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultUrl || '');

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(imageUrl);
    }
  }, [imageUrl]);

  const beforeUpload = (file: File) => {
    const allow = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg',
      'image/heif',
    ];
    const typeIsAllow = allow.includes(file.type);
    if (!typeIsAllow) {
      message.error(
        '上传的图片类型不符合要求: jpeg、jpg、png、webp、gif、svg、heif',
      );
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('图片大小不能超过20M');
    }
    if (typeIsAllow && isLt2M) {
      setLoading(true);
      uploadImage(file as any, {
        type: 'OPS',
      })
        .then((uploadResult) => {
          const url = `https://c-ssl.dtstatic.com${uploadResult.key}`;
          setImageUrl(url);
        })
        .catch(() => {
          setImageUrl('');
          message.error('图片上传失败');
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return false;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <Flex style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
      <div>
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          maxCount={1}>
          {imageUrl ? (
            <img src={imageUrl} alt="upload" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
      <Input
        placeholder="图片链接"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
        }}
      />
    </Flex>
  );
};
