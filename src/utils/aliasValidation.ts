import { communityApi } from 'src/transport/communities/communities.api.ts';

export const aliasValidation = async (newAlias: string, initAlias?: string) => {
  if (!newAlias) {
    return;
  }

  if (newAlias === initAlias) {
    return Promise.resolve();
  }

  try {
    const response = await communityApi.isExistsByAlias(newAlias);
    if (response) {
      return Promise.reject(new Error('This community alias already exists'));
    }
    return Promise.resolve();
  } catch {
    return Promise.reject(new Error('This community alias already exists'));
  }
};
