import { useCallback, useMemo } from 'react';
import { Select } from 'antd';
import { useGetDeployCategoriesApi } from '../api';

export const DeployCategorySelect = ({
  category,
  setCategory,
  setCategoryName,
  hasEmpty,
}: {
  category: string;
  setCategory: (category: string) => void;
  setCategoryName?: (category: string) => void;
  hasEmpty?: boolean;
}) => {
  const { getDeployCategories, categories, loading, more, reset } =
    useGetDeployCategoriesApi();

  const categoryOptions = useMemo(
    () =>
      hasEmpty
        ? [
            { label: '所有', value: '' },
            ...categories.map((categoryData) => ({
              label: categoryData.name,
              value: categoryData.value,
            })),
          ]
        : categories.map((categoryData) => ({
            label: categoryData.name,
            value: categoryData.value,
          })),
    [categories],
  );

  const onDropdownVisibleChange = useCallback(
    (open: boolean) => {
      if (open) {
        reset();
        getDeployCategories();
      }
    },
    [categories, getDeployCategories],
  );

  const onPopupScroll = useCallback(
    (event: any) => {
      if (
        !loading &&
        more &&
        event.target.scrollHeight -
          event.target.scrollTop -
          event.target.offsetHeight <=
          50
      ) {
        getDeployCategories();
      }
    },
    [loading, more],
  );

  const onChange = useCallback(
    (
      value: string,
      option:
        | { label: string; value: string }
        | { label: string; value: string }[],
    ) => {
      setCategory(value);
      if (typeof setCategoryName === 'function') {
        setCategoryName((option as { label: string; value: string }).label);
      }
    },
    [],
  );

  return (
    <Select
      loading={loading}
      style={{ width: '200px' }}
      value={category}
      onChange={onChange}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onPopupScroll={onPopupScroll}
      options={categoryOptions}
    />
  );
};
