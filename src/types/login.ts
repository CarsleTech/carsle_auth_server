type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  status: number;
  token: string;
};