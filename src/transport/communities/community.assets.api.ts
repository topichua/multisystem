import { PaginationResponse } from '../types';
import {
  AssetsTypeEnum,
  CommunityAssetsFolder,
  CommunityAssetsItem,
} from './communities.dto';

export const communityAssetsApi = {
  async createCommunityAssetsFolder(
    communityId: string,
    name: string,
    description: string
  ) {
    ensureCommunityInitialized(communityId);
    const folders = mockFoldersStore[communityId];
    const newFolder: CommunityAssetsFolder = {
      id: `folder-${communityId}-${Date.now()}`,
      name,
      description,
      expanded: false,
      order: folders.length + 1,
      createdAt: new Date(MOCK_TIME_BASE + folders.length * 1234567),
      communityId,
    };
    mockFoldersStore[communityId] = [...folders, newFolder];
    return Promise.resolve(null);
  },

  async getCommunityAssetsFolders(
    communityId?: string
  ): Promise<PaginationResponse<{ folders: CommunityAssetsFolder[] }>> {
    ensureCommunityInitialized(communityId as string);
    const folders = [...mockFoldersStore[communityId as string]].sort(
      (a, b) => a.order - b.order
    );
    return Promise.resolve({
      folders,
      args: { page: 1, pageSize: folders.length },
      totalItemCount: folders.length,
    });
  },

  async deleteCommunityAssetsFolder(communityId: string, folderId: string) {
    ensureCommunityInitialized(communityId);
    mockFoldersStore[communityId] = (mockFoldersStore[communityId] || []).filter(
      (f) => f.id !== folderId
    );
    delete mockAssetsStore[folderId];
    // Reassign orders
    mockFoldersStore[communityId] = mockFoldersStore[communityId]
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((f, idx) => ({ ...f, order: idx + 1 }));
    return Promise.resolve(null);
  },

  async uploadCommunityAssetsItem(
    communityId: string,
    folderId: string,
    payload: any
  ) {
    ensureCommunityInitialized(communityId);
    const assets = mockAssetsStore[folderId] || [];
    const id = `asset-${folderId}-${Date.now()}`;
    const isLink = payload?.type === 'link';
    const fileName =
      payload?.name ||
      (isLink ? `Link ${assets.length + 1}` : `File ${assets.length + 1}.pdf`);
    const type = isLink ? AssetsTypeEnum.Link : AssetsTypeEnum.PDF;
    const path = isLink
      ? payload?.data || `https://example.com/resource-${assets.length + 1}`
      : `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;

    const newAsset: CommunityAssetsItem = {
      id,
      fileName,
      name: payload?.name || fileName,
      description: payload?.description || '',
      type,
      createdAt: new Date(MOCK_TIME_BASE + assets.length * 987654),
      path,
    };
    mockAssetsStore[folderId] = [...assets, newAsset];
    return Promise.resolve(null);
  },

  async updateCommunityAssetsFolder(
    communityId: string,
    folderId: string,
    item: { name: string; description?: string }
  ) {
    ensureCommunityInitialized(communityId);
    mockFoldersStore[communityId] = (mockFoldersStore[communityId] || []).map(
      (f) =>
        f.id === folderId
          ? {
              ...f,
              name: item.name,
              description: item.description ?? f.description ?? '',
            }
          : f
    );
    return Promise.resolve(null);
  },

  async updateCommunityAssetsItem(
    communityId: string,
    folderId: string,
    assetId: string,
    item: { name: string; description: string }
  ) {
    ensureCommunityInitialized(communityId);
    mockAssetsStore[folderId] = (mockAssetsStore[folderId] || []).map((a) =>
      a.id === assetId
        ? {
            ...a,
            name: item.name ?? a.name,
            description: item.description ?? a.description,
            path: (item as any)?.path ?? a.path,
          }
        : a
    );
    return Promise.resolve(null);
  },

  async getCommunityAssetsItems(
    communityId: string,
    folderId: string
  ): Promise<PaginationResponse<{ assets: CommunityAssetsItem[] }>> {
    ensureCommunityInitialized(communityId);
    const assets = mockAssetsStore[folderId] || [];
    return Promise.resolve({
      assets,
      args: { page: 1, pageSize: assets.length },
      totalItemCount: assets.length,
    });
  },

  async getCommunityAssetsItem(communityId: string, folderId: string) {
    return communityAssetsApi.getCommunityAssetsItems(communityId, folderId);
  },

  async deleteCommunityAssetsItem(
    communityId: string,
    folderId: string,
    assetId: string
  ) {
    ensureCommunityInitialized(communityId);
    mockAssetsStore[folderId] = (mockAssetsStore[folderId] || []).filter(
      (a) => a.id !== assetId
    );
    return Promise.resolve(null);
  },

  assetsFolderReorder(communityId: string, folderId: string, newOrder: number) {
    ensureCommunityInitialized(communityId);
    const folders = [...(mockFoldersStore[communityId] || [])].sort(
      (a, b) => a.order - b.order
    );
    const index = folders.findIndex((f) => f.id === folderId);
    if (index === -1) return Promise.resolve(null);
    const [moved] = folders.splice(index, 1);
    folders.splice(Math.max(0, newOrder - 1), 0, moved);
    mockFoldersStore[communityId] = folders.map((f, idx) => ({
      ...f,
      order: idx + 1,
    }));
    return Promise.resolve(null);
  },

  assetReorder(
    communityId: string,
    folderId: string,
    assetId: string,
    newOrder: number
  ) {
    ensureCommunityInitialized(communityId);
    const assets = [...(mockAssetsStore[folderId] || [])];
    const index = assets.findIndex((a) => a.id === assetId);
    if (index === -1) return Promise.resolve(null);
    const [moved] = assets.splice(index, 1);
    assets.splice(Math.max(0, newOrder - 1), 0, moved);
    mockAssetsStore[folderId] = assets;
    return Promise.resolve(null);
  },
};

// ---------- Mock helpers and stores ----------
const MOCK_TIME_BASE = 1735689600000; // 2025-01-01 for stable dates

const mockFoldersStore: Record<string, CommunityAssetsFolder[]> = {};
const mockAssetsStore: Record<string, CommunityAssetsItem[]> = {};

function ensureCommunityInitialized(communityId: string) {
  if (!mockFoldersStore[communityId]) {
    mockFoldersStore[communityId] = buildDefaultFolders(communityId);
    // Initialize assets for each folder
    for (const folder of mockFoldersStore[communityId]) {
      mockAssetsStore[folder.id] = buildDefaultAssets(communityId, folder.id);
    }
  }
}

function buildDefaultFolders(
  communityId: string
): CommunityAssetsFolder[] {
  const names = ['General Resources', 'Meeting Materials', 'Images'];
  return names.map((name, idx) => ({
    id: `folder-${communityId}-${idx + 1}`,
    name,
    description:
      idx === 0
        ? 'Docs, guides and helpful links'
        : idx === 1
          ? 'Slides, recordings and agendas'
          : 'Logos and screenshots',
    expanded: false,
    order: idx + 1,
    createdAt: new Date(MOCK_TIME_BASE + idx * 86400_000),
    communityId,
  }));
}

function buildDefaultAssets(
  communityId: string,
  folderId: string
): CommunityAssetsItem[] {
  const types = [
    AssetsTypeEnum.PDF,
    AssetsTypeEnum.PPTX,
    AssetsTypeEnum.JPG,
    AssetsTypeEnum.MP4,
    AssetsTypeEnum.Link,
  ];
  return Array.from({ length: 5 }, (_, i) => {
    const type = types[i % types.length];
    const id = `asset-${folderId}-${i + 1}`;
    const baseName =
      type === AssetsTypeEnum.Link
        ? `Useful Link ${i + 1}`
        : type === AssetsTypeEnum.PDF
          ? `Guide ${i + 1}.pdf`
          : type === AssetsTypeEnum.PPTX
            ? `Slides ${i + 1}.pptx`
            : type === AssetsTypeEnum.MP4
              ? `Recording ${i + 1}.mp4`
              : `Image ${i + 1}.jpg`;
    const path =
      type === AssetsTypeEnum.Link
        ? `https://example.com/resource-${communityId}-${i + 1}`
        : type === AssetsTypeEnum.PDF
          ? `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
          : type === AssetsTypeEnum.PPTX
            ? `https://filesamples.com/samples/document/pptx/sample3.pptx`
            : type === AssetsTypeEnum.MP4
              ? `https://filesamples.com/samples/video/mp4/sample_640x360.mp4`
              : `https://picsum.photos/seed/${id}/600/400`;

  return {
      id,
      fileName: baseName,
      name: baseName,
      description: `Auto-generated asset ${i + 1} for ${communityId}`,
      type,
      createdAt: new Date(MOCK_TIME_BASE + i * 3600_000),
      path,
    };
  });
}
