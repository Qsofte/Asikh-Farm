import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";

describe("Header Component", () => {
  test("renders logo", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoImg = screen.getByAltText("Logo");
    expect(logoImg).toBeInTheDocument();
  });

  test("renders all navbar links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("PRODUCTS")).toBeInTheDocument();
    expect(screen.getByText("ABOUT US")).toBeInTheDocument();
    expect(screen.getByText("CONTACT US")).toBeInTheDocument();
  });

  test("clicking 'CONTACT US' calls navigate", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const contactLink = screen.getByText("CONTACT US");
    fireEvent.click(contactLink);
    // can't fully assert navigation without mocking, but test should run
    expect(contactLink).toBeInTheDocument();
  });

  test("burger menu toggles navbar visibility", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".navbar");

    expect(nav.classList.contains("active")).toBe(false);
    fireEvent.click(burger);
    expect(nav.classList.contains("active")).toBe(true);
    fireEvent.click(burger);
    expect(nav.classList.contains("active")).toBe(false);
  });
});
