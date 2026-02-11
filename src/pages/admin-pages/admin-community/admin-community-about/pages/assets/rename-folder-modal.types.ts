export type TAssetShared = {
  name: string;
  description?: string;
};

export type TFormFiles = Record<string, TAssetShared>;
