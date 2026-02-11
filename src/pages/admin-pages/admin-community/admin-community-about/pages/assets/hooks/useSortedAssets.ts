import { useMemo, useState } from 'react';
import { CommunityAssetsFolder } from 'src/transport/communities/communities.dto';

export type TSortingField = Pick<
  CommunityAssetsFolder,
  'createdAt' | 'description' | 'name'
>;

export type CommunityAssetFolderField = keyof TSortingField;
export type TSortingOrder = 'ASC' | 'DESC' | null;

const useSortedAssets = (assets: CommunityAssetsFolder[]) => {
  const [sortingField, setSortingField] =
    useState<CommunityAssetFolderField | null>(null);
  const [sortingOrder, setSortingOrder] = useState<TSortingOrder>(null);

  const handleSort = (field: CommunityAssetFolderField) => {
    if (field === sortingField) {
      setSortingOrder(sortingOrder === 'DESC' ? 'ASC' : 'DESC');
    } else {
      setSortingField(field);
      setSortingOrder('DESC');
    }
  };

  const handleSortClear = () => {
    setSortingField(null);
    setSortingOrder(null);
  };

  const sortedAssets = useMemo(() => {
    if (!sortingField || !sortingOrder) return assets;

    return [...assets].sort((a, b) => {
      if (sortingField === 'createdAt') {
        const dateA = new Date(a[sortingField]).getTime();
        const dateB = new Date(b[sortingField]).getTime();
        return sortingOrder === 'ASC' ? dateA - dateB : dateB - dateA;
      }

      const valueA = String(a[sortingField]).toLowerCase();
      const valueB = String(b[sortingField]).toLowerCase();

      if (valueA < valueB) return sortingOrder === 'ASC' ? -1 : 1;
      if (valueA > valueB) return sortingOrder === 'ASC' ? 1 : -1;

      return a.id.localeCompare(b.id);
    });
  }, [assets, sortingField, sortingOrder]);

  return {
    sortedAssets,
    sortingField,
    sortingOrder,
    handleSort,
    handleSortClear,
  };
};

export default useSortedAssets;
