export enum EngagementAction {
  ViewPage = 'viewPage',
  ViewEvent = 'viewEvent',
  ViewNews = 'viewNews',
  DownloadAsset = 'downloadAsset',
  ViewCommunity = 'viewCommunity',
  JoinCommunity = 'joinCommunity',
  LoggedIn = 'loggedIn',
  RegisterEvent = 'registerEvent',
  PurchaseProduct = 'purchaseProduct',
}

export interface EngagementTrackPayload {
  action: EngagementAction;
  entityId?: string;
  entityUrl: string;
  entityName: string;
}
