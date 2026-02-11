import { createContext, useMemo } from 'react';

import { ResourceStore } from 'src/store/resources/resource-store';

import { ResourceDetailsPage } from '../resources-details-page';

export const ResourceDetailsProvider = () => {
  const resourcesStore = useMemo(() => new ResourceStore(), []);

  return (
    <ResourceDetailsStoreContext.Provider value={resourcesStore}>
      <ResourceDetailsPage />
    </ResourceDetailsStoreContext.Provider>
  );
};

export const ResourceDetailsStoreContext = createContext<ResourceStore>(
  {} as ResourceStore
);
