import { render, screen } from "@testing-library/react";
import { createMock } from "ts-jest-mock";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  it("renders corretly when user is not authenticated", () => {
    const useSessionMocked = createMock(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SignInButton />);
    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders corretly when user is authenticated", () => {
    const useSessionMocked = createMock(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "jonhdoe@example.com" },
        expires: "fake-token",
      },
      status: "authenticated",
    });

    render(<SignInButton />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
