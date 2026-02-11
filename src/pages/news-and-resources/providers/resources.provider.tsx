import { createContext, useMemo } from 'react';

import { ResourceCategoryStore } from 'src/store/resources/resource-category-store';
import { ResourceStore } from 'src/store/resources/resource-store';
import { ResourceTagStore } from 'src/store/resources/resource-tag-store';

import { ResourcesPage } from '../resources';

export const ResourcesProvider = () => {
  const resourcesStore = useMemo(() => new ResourceStore(), []);
  const resourceTagStore = useMemo(() => new ResourceTagStore(), []);
  const resourceCategoryStore = useMemo(() => new ResourceCategoryStore(), []);

  return (
    <ResourcesStoreContext.Provider value={resourcesStore}>
      <ResourceTagStoreContext.Provider value={resourceTagStore}>
        <ResourceCategoryStoreContext.Provider value={resourceCategoryStore}>
          <ResourcesPage />
        </ResourceCategoryStoreContext.Provider>
      </ResourceTagStoreContext.Provider>
    </ResourcesStoreContext.Provider>
  );
};

export const ResourcesStoreContext = createContext<ResourceStore>(
  {} as ResourceStore
);

export const ResourceTagStoreContext = createContext<ResourceTagStore>(
  {} as ResourceTagStore
);

export const ResourceCategoryStoreContext =
  createContext<ResourceCategoryStore>({} as ResourceCategoryStore);
