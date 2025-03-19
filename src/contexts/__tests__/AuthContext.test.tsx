import { act, renderHook, RenderHookResult } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabase";
import { vi } from "vitest";
import { Session, AuthError } from "@supabase/supabase-js";

// Mock the Supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides authentication context to children", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    const mockSession = {
      user: mockUser,
      access_token: "mock-token",
      refresh_token: "mock-refresh",
      expires_in: 3600,
      token_type: "bearer",
    } as Session;

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });

    let result: RenderHookResult<ReturnType<typeof useAuth>, unknown>;

    await act(async () => {
      result = renderHook(() => useAuth(), {
        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
      });
    });

    expect(result!.result.current.user).toEqual(mockSession.user);
    expect(result!.result.current.loading).toBe(false);
    expect(typeof result!.result.current.signIn).toBe("function");
    expect(typeof result!.result.current.signOut).toBe("function");
  });

  it("handles sign in", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    (
      supabase.auth.signInWithPassword as jest.MockedFunction<
        typeof supabase.auth.signInWithPassword
      >
    ).mockResolvedValue({
      data: {
        user: mockUser,
        session: {
          user: mockUser,
          access_token: "mock-token",
          refresh_token: "mock-refresh",
          expires_in: 3600,
          token_type: "bearer",
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await result.current.signIn("test@example.com", "password");
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
  });

  it("handles sign out", async () => {
    (
      supabase.auth.signOut as jest.MockedFunction<typeof supabase.auth.signOut>
    ).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it("handles authentication errors", async () => {
    const mockError = {
      name: "AuthError",
      message: "Auth error",
      status: 401,
      __isAuthError: true,
    } as unknown as AuthError;

    (
      supabase.auth.signInWithPassword as jest.MockedFunction<
        typeof supabase.auth.signInWithPassword
      >
    ).mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: mockError,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await expect(
      act(async () => {
        await result.current.signIn("test@example.com", "password");
      })
    ).rejects.toThrow("Auth error");
  });
});
