export type MembershipProfile = {
  id: string;
  joinDate: string | null;
  memberNum: string;
  memberStatus: string | null;
  membershipName: string;
  renewedToDate: string;
  terminationDate: string | null;
};

export type GetMembershipManageLinkResponse = {
  data: {
    label: string;
    url: string;
  };
  message: string;
};

export type GetUpdatePaymentLinkResponse = {
  data: string;
  message: string;
};
