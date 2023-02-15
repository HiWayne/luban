import { useCallback, useMemo } from 'react';
import { Select } from 'antd';
import { useGetDeployCategoriesApi } from '../api';

export const DeployCategorySelect = ({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (category: string) => void;
}) => {
  const { getDeployCategories, categories, loading, more, reset } =
    useGetDeployCategoriesApi();

    
    
    const categoryOptions = useMemo(
      () =>
      categories.map((categoryData) => ({
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

  return (
    <Select
      loading={loading}
      style={{ width: '200px' }}
      value={category}
      onChange={setCategory}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onPopupScroll={onPopupScroll}
      options={categoryOptions}
    />
  );
};
