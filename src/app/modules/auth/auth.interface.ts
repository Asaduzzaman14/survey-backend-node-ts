export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  userId?: string | undefined;
};

export type ILoginUser = {
  email: string;
  password: string;
};
