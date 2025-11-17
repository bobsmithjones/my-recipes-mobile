// Mock user returned by "getMe"
const MOCK_USER = {
  id: 1,
  email: "test@example.com",
};

// Fake login – always succeeds
export async function login(email: string, password: string) {
  console.log("Mock login:", email);

  // simulate network delay
  await new Promise((r) => setTimeout(r, 400));

  return {
    access_token: "mock-token-123",
    token_type: "bearer",
  };
}

// Returns the mock user
export async function getMe(token?: string) {
  console.log("Mock getMe, token:", token);

  // simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  return MOCK_USER;
}

// Optional: mock register
export async function register(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 400));

  return {
    id: 99,
    email,
  };
}
