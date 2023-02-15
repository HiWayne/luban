import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Input, InputRef, message } from 'antd';
import produce from 'immer';

export const PathInput = ({
  onChange,
  max = 2,
}: {
  onChange: (path: string) => void;
  max?: number;
}) => {
  const [pathCount, setPathCount] = useState(1);
  const [paths, setPaths] = useState<string[]>(['']);

  const [focusIndex, setFocusIndex] = useState<number | undefined>();
  const inputsRef: MutableRefObject<InputRef[]> = useRef([]);

  const path = useMemo(
    () =>
      paths.reduce(
        (fullPath, _path, index) =>
          _path ? (index === 0 ? _path : `${fullPath}/${_path}`) : fullPath,
        '',
      ),
    [paths],
  );

  useEffect(() => {
    if (typeof focusIndex === 'number') {
      if (inputsRef.current[focusIndex]) {
        inputsRef.current[focusIndex].focus();
      }
    }
  }, [focusIndex]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(path);
    }
  }, [path]);

  return (
    <>
      {new Array(pathCount).fill(true).map((_, index) => (
        <span key={index}>
          {index !== 0 ? <span style={{ margin: '0 8px' }}>/</span> : null}
          <Input
            style={{ width: '180px' }}
            ref={(inputRef) => {
              if (inputRef) {
                inputsRef.current[index] = inputRef;
              }
            }}
            maxLength={20}
            placeholder="e.g. path、path1/path2"
            value={paths[index]}
            onChange={(e) => {
              const value = e.target.value;
              if (value.endsWith('/') && value.length > 1) {
                if (pathCount < max) {
                  setPathCount((count) => count + 1);
                  setPaths([...paths, '']);
                  setFocusIndex(paths.length);
                } else {
                  message.warning(`最多${max}级路径`);
                }
              } else if (!value) {
                if (paths.length > 1) {
                  setPathCount((count) => count - 1);
                  setPaths(
                    produce(paths, (draft) => {
                      draft.splice(index, 1);
                    }),
                  );
                  setFocusIndex(paths.length - 2);
                } else {
                  setPaths([value]);
                }
              } else if (/^[a-zA-Z\d/]+$/.test(value)) {
                setPaths(
                  produce(paths, (draft) => {
                    draft[index] = value.replaceAll('/', '');
                  }),
                );
              } else {
                message.warning('路径只能输入字母、数字、/');
              }
            }}
          />
        </span>
      ))}
    </>
  );
};
