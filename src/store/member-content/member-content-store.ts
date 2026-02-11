import { action, makeObservable, observable } from 'mobx';
import { getContentPages } from 'src/transport/memberContent/memberContent.api';

import { ContentPage } from 'src/transport/memberContent/memberContent.dto';

export class MemberContentStore {
  public isPagesLoading: boolean = false;
  public pages: ContentPage[] = [];

  constructor() {
    makeObservable(this, {
      isPagesLoading: observable,
      pages: observable,
      loadPages: action.bound,
    });
  }

  public async loadPages() {
    this.isPagesLoading = true;

    return getContentPages()
      .then((res) => {
        this.pages = res.data;
      })
      .finally(() => {
        this.isPagesLoading = false;
      });
  }
}
