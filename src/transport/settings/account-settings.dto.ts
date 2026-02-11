export type TitleResponse = {
  [key in 'Miss' | 'Mr' | 'Mrs' | 'Ms']: string;
};

export type GenderResponse = {
  [key in 'M' | 'F' | 'D' | 'X']: string;
};
