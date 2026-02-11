import { makeAutoObservable, runInAction } from 'mobx';
import { communicationPreferencesApi } from 'src/transport/communicationPreferences/communication-preferences.api';
import { settingsAPI } from 'src/transport/settings/setting.api';

export class CommunicationPreferncesStore {
  public userPreferences: {
    segmentId: string;
    segmentName: string;
  }[] = [];
  public listOfPreferences: { id: string; name: string }[] = [];
  public isLoadingListOfPreferences = false;
  public isLoadingUserPreferences = false;
  public loadingPreferences: { [key: string]: boolean } = {};

  constructor() {
    makeAutoObservable(this);
    this.fetchAllCommunicationPrefs();
    this.fetchUserCommunicationPrefs();
  }

  isPreferenceAdded = (id: string) => {
    return this.userPreferences.some((pref) => {
      return pref.segmentId == id;
    });
  };

  setLoadingPrefernces = (id: string, isLoading: boolean) => {
    runInAction(() => {
      this.loadingPreferences[id] = isLoading;
    });
  };

  addPreferenceToUser = (interest: { id: string; name: any }) => {
    this.setLoadingPrefernces(interest.id, true);
    settingsAPI
      .addInterestToUser(interest.id)
      .then(() => {
        runInAction(() => {
          this.fetchUserCommunicationPrefs();
        });
      })
      .catch((error) => {
        console.error('Failed to add interest:', error);
      })
      .finally(() => {
        this.setLoadingPrefernces(interest.id, false);
      });
  };

  removePreferenceFromUser = (id: string) => {
    this.setLoadingPrefernces(id, true);
    settingsAPI
      .removeInterestFromUser(id)
      .then(() => {
        runInAction(() => {
          this.fetchUserCommunicationPrefs();
        });
      })
      .catch((error) => {
        console.error('Failed to remove interest:', error);
      })
      .finally(() => {
        this.setLoadingPrefernces(id, false);
      });
  };

  fetchAllCommunicationPrefs() {
    this.isLoadingListOfPreferences = true;
    communicationPreferencesApi
      .getAllCommunicationPreferences()
      .then((res) => {
        runInAction(() => {
          this.listOfPreferences = Object.keys(res.data).map((id) => ({
            id,
            name: res.data[id],
          }));
        });
      })
      .catch((error) => {
        console.error('Failed to fetch user interests:', error);
      })
      .finally(() => {
        this.isLoadingListOfPreferences = false;
      });
  }
  fetchUserCommunicationPrefs() {
    this.isLoadingUserPreferences = true;
    communicationPreferencesApi
      .getUserCommunicationPreferences()
      .then((res) => {
        runInAction(() => {
          this.userPreferences = res.data;
        });
      })
      .catch((error) => {
        console.error('Failed to fetch user interests:', error);
      })
      .finally(() => {
        this.isLoadingUserPreferences = false;
      });
  }
}
