import { makeAutoObservable, runInAction } from 'mobx';
import { settingsAPI } from 'src/transport/settings/setting.api';

export class InterestsStore {
  public userInterests: { segmentId: string; segmentName: string }[] = [];
  public areaOfInterests: { id: string; name: string }[] = [];
  public isLoadingUserInterests = false;
  public isLoadingAreaOfInterests = false;
  public loadingInterests: { [key: string]: boolean } = {};

  constructor() {
    makeAutoObservable(this);
    this.fetchUserInterests();
    this.fetchAreaOfInterests();
  }

  isInterestAdded = (id: string) => {
    return this.userInterests.some((interest) => {
      return interest.segmentId == id;
    });
  };

  setLoadingInterest = (id: string, isLoading: boolean) => {
    runInAction(() => {
      this.loadingInterests[id] = isLoading;
    });
  };

  addInterestToUser = (interest: { id: string; name: any }) => {
    this.setLoadingInterest(interest.id, true);
    settingsAPI
      .addInterestToUser(interest.id)
      .then(() => {
        runInAction(() => {
          this.fetchUserInterests();
        });
      })
      .catch((error) => {
        console.error('Failed to add interest:', error);
      })
      .finally(() => {
        this.setLoadingInterest(interest.id, false);
      });
  };

  removeInterestFromUser = (id: string) => {
    this.setLoadingInterest(id, true);
    settingsAPI
      .removeInterestFromUser(id)
      .then(() => {
        runInAction(() => {
          this.fetchUserInterests();
        });
      })
      .catch((error) => {
        console.error('Failed to remove interest:', error);
      })
      .finally(() => {
        this.setLoadingInterest(id, false);
      });
  };

  fetchUserInterests = () => {
    this.isLoadingUserInterests = true;
    settingsAPI
      .getUserInterests()
      .then((res) => {
        runInAction(() => {
          this.userInterests = res;
        });
      })
      .catch((error) => {
        console.error('Failed to fetch user interests:', error);
      })
      .finally(() => {
        runInAction(() => {
          this.isLoadingUserInterests = false;
        });
      });
  };

  fetchAreaOfInterests = () => {
    this.isLoadingAreaOfInterests = true;
    settingsAPI
      .getAllAreaOfInterests()
      .then((data) => {
        runInAction(() => {
          this.areaOfInterests = Object.keys(data).map((id) => ({
            id,
            name: data[id],
          }));
        });
      })
      .catch((error) => {
        console.error('Failed to fetch area of interests:', error);
      })
      .finally(() => {
        runInAction(() => {
          this.isLoadingAreaOfInterests = false;
        });
      });
  };
}
