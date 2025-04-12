// Footer.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

const mockNavigate = vi.fn();

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Footer Component", () => {
  test("renders logo and text", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    expect(screen.getByAltText(/asikh farms logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Asikh Farms/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover the essence of Asikh Farms/i)).toBeInTheDocument();
  });

  test("clicking 'Contact Us' navigates to /contact", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    const contactLink = screen.getAllByText("Contact Us")[0]; // gets first one
    fireEvent.click(contactLink);
    expect(mockNavigate).toHaveBeenCalledWith("/contact");
  });

  test("clicking 'Privacy Policy' navigates to /privacy", () => {
    render(<Footer />, { wrapper: MemoryRouter });
    const privacyLink = screen.getByText("Privacy Policy");
    fireEvent.click(privacyLink);
    expect(mockNavigate).toHaveBeenCalledWith("/privacy");
  });
});
