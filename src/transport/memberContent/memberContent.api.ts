import { axiosDirectusInstance } from '../axios/axios-instance-directus';
import { GetContentPagesResponse } from './memberContent.dto';

export const getContentPages = async (): Promise<GetContentPagesResponse> => {
  return await axiosDirectusInstance.get(
    `/items/page?filter[membersOnly]=true&fields=id,name`
  );
};
