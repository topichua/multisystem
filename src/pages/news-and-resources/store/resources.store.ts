import { useContext } from 'react';

import { ResourceDetailsStoreContext } from '../providers/resources-details.provider';
import * as P from '../providers/resources.provider';

export const useResourceCategoryStore = () =>
  useContext(P.ResourceCategoryStoreContext);
export const useResourceTagStore = () => useContext(P.ResourceTagStoreContext);
export const useResourcesStore = () => useContext(P.ResourcesStoreContext);
export const useResourceDetailsStore = () =>
  useContext(ResourceDetailsStoreContext);
