import { render, screen, waitFor } from "@testing-library/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { vi } from "vitest";
import GoogleSignIn from "../../components/GoogleSignIn";
import { useLoading } from "../../contexts/LoadingContext";
import { auth } from "../../services/firebase";
import { initializeUserDocument } from "../../services/firestore";
import Auth from "./Auth";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("../../services/firebase", () => ({
  auth: {},
}));

vi.mock("../../services/firestore", () => ({
  initializeUserDocument: vi.fn(),
}));

vi.mock("../../contexts/LoadingContext", () => ({
  useLoading: vi.fn(),
}));

vi.mock("../../components/GoogleSignIn", () => ({
  default: vi.fn(),
}));

describe("Auth Component", () => {
  const mockSetLoading = vi.fn();
  const mockOnUserLogin = vi.fn();
  const mockUser = { uid: "test-uid" } as User;

  beforeEach(() => {
    vi.clearAllMocks();

    (useLoading as jest.Mock).mockReturnValue({ setLoading: mockSetLoading });
    (GoogleSignIn as jest.Mock).mockImplementation(({ onUserLogin }) => (
      <button onClick={() => onUserLogin(mockUser)}>Sign In with Google</button>
    ));
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });
  });

  test("renders main title and GoogleSignIn component", () => {
    render(<Auth onUserLogin={mockOnUserLogin} />);

    expect(
      screen.getByText("Want to start managing your budget?")
    ).toBeInTheDocument();
    expect(screen.getByText("Sign In with Google")).toBeInTheDocument();
  });

  test("calls onAuthStateChanged with the correct parameters", () => {
    render(<Auth onUserLogin={mockOnUserLogin} />);

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
  });

  test("sets loading state and calls initializeUserDocument on user login", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    render(<Auth onUserLogin={mockOnUserLogin} />);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockOnUserLogin).toHaveBeenCalledWith(mockUser);
    expect(initializeUserDocument).toHaveBeenCalledWith("test-uid");
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  test("sets loading state correctly when no user is present", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(<Auth onUserLogin={mockOnUserLogin} />);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockOnUserLogin).not.toHaveBeenCalled();
    expect(initializeUserDocument).not.toHaveBeenCalled();
  });

  test("cleans up on component unmount", () => {
    const unsubscribeMock = vi.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribeMock);

    const { unmount } = render(<Auth onUserLogin={mockOnUserLogin} />);
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
