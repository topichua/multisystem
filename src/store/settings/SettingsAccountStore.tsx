import { action, makeObservable, observable, reaction } from 'mobx';
import { accountAPI } from 'src/transport/account/account.api';
import { UserProfileDto } from 'src/transport/account/account.dto';
import {
  GenderResponse,
  TitleResponse,
} from 'src/transport/settings/account-settings.dto';

export class SettingsAccountStore {
  isDataLoading: boolean = false;
  isUserUpdating: boolean = false;
  titles: TitleResponse | null = null;
  genders: GenderResponse | null = null;
  titlesArray: Array<{ key: string; value: string }> | null = null;
  gendersArray: Array<{ key: string; value: string }> | null = null;
  values: UserProfileDto | null = null;

  constructor() {
    makeObservable(this, {
      isDataLoading: observable,
      isUserUpdating: observable,
      titles: observable,
      genders: observable,
      titlesArray: observable,
      gendersArray: observable,
      values: observable,
      loadAccountSettingsData: action.bound,
      updateUser: action.bound,
    });
    reaction(
      () => {},
      () => {}
    );
  }

  public async loadAccountSettingsData() {
    this.isDataLoading = true;
    const res = await accountAPI.getBondMxCurrent();
    this.values = res.data;

    this.gendersArray = [
      { key: 'M', value: 'M - Man or Male' },
      { key: 'F', value: 'F - Woman or Female' },
      { key: 'X', value: 'X - Non-binary' },
      { key: 'T', value: 'T - Different term' },
      { key: 'Z', value: 'Z - Prefer not to answer' },
    ];
    this.titlesArray = [
      { key: 'A/Prof', value: 'A/Prof' },
      { key: 'Dr', value: 'Dr' },
      { key: 'E/Prof', value: 'E/Prof' },
      { key: 'Hon', value: 'Hon' },
      { key: 'Miss', value: 'Miss' },
      { key: 'Mr', value: 'Mr' },
      { key: 'Mrs', value: 'Mrs' },
      { key: 'Ms', value: 'Ms' },
      { key: 'Mx', value: 'Mx' },
      { key: 'Prof', value: 'Prof' },
      { key: 'Sir', value: 'Sir' },
      { key: 'Staff', value: 'Staff' },
    ];
    this.isDataLoading = false;
  }

  public updateUser(values: UserProfileDto) {
    this.isUserUpdating = true;
    accountAPI.saveBondMxCurrentProfile(values).finally(() => {
      this.isUserUpdating = false;
    });
  }
}
