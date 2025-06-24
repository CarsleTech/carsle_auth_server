type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

type SignupResponse = {
  user: User;
  status: number;
  token: string;
};