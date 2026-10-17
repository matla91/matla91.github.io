import { describe, it, expect, vi } from "vitest";
import { act, render, screen, fireEvent, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import App from "../src/App";
import ScientificVisual from "../src/components/ScientificVisual";
import { projects } from "../src/content/portfolio";

describe("recruiter journey and accessible interactions", () => {
  it("renders meaningful content on the server, including all main sections", () => {
    const html = renderToString(<App path="/" />);
    for (const id of [
      "main",
      "about",
      "organizations",
      "education",
      "experience",
      "skills",
      "highlights",
      "projects",
      "contact",
    ])
      expect(html).toContain(`id="${id}"`);
    expect(html).toContain("MATTHIS");
    expect(html).toContain("Research Intern");
    expect(html).not.toContain("none@example.org");
  });
  it("ships visible brand marks as eager, self-hosted image URLs", () => {
    const html = renderToString(<App path="/" />);
    for (const logo of [
      "isl.webp",
      "magyar.webp",
      "ensisa.webp",
      "uqac.svg",
    ]) {
      expect(html).toContain(`src="/brandmarks/${logo}"`);
    }
    expect((html.match(/loading="eager"/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });
  it("reveals a verified organization relationship and a matching section link", async () => {
    render(<App />);
    const button = screen.getByRole("button", {
      name: /ISL.*Research internship/i,
    });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const link = await screen.findByRole("link", { name: "View experience" });
    expect(link.getAttribute("href")).toBe("#experience-isl");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
  it("opens and closes the mobile navigation with Escape", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });
  it("dismisses navigation when keyboard focus leaves it without stealing focus", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    const nav = screen.getByRole("navigation");
    act(() => within(nav).getByRole("link", { name: "About" }).focus());
    // Tabbing between menu items keeps the menu open.
    act(() => within(nav).getByRole("link", { name: "CV" }).focus());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const work = screen.getByRole("link", { name: "Explore my work" });
    act(() => work.focus());
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(work);
  });
  it("reveals an off-screen block immediately when reached with the keyboard", () => {
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    });
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: 1200 } as DOMRect);
    try {
      const { unmount } = render(<App />);
      const org = document.querySelector("#organizations [data-reveal]")!;
      expect(org.classList.contains("will-reveal")).toBe(true);
      expect(org.classList.contains("is-revealed")).toBe(false);
      const logo = screen.getByRole("button", { name: "ISL — Research internship" });
      logo.focus();
      expect(org.classList.contains("is-revealed")).toBe(true);
      expect(unobserve).toHaveBeenCalledWith(org);
      logo.blur();
      expect(org.classList.contains("is-revealed")).toBe(true);
      unmount();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      rect.mockRestore();
      vi.unstubAllGlobals();
    }
  });
  it("expands and collapses highlights and project archive", () => {
    render(<App />);
    const show = screen.getByRole("button", { name: "Show all highlights" });
    fireEvent.click(show);
    expect(show.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("more-highlights")?.hidden).toBe(false);
    fireEvent.click(show);
    expect(document.getElementById("more-highlights")?.hidden).toBe(true);
    const archive = screen.getByRole("button", { name: "Open archive" });
    fireEvent.click(archive);
    expect(
      screen.getByRole("link", {
        name: /Radisson.*Local information retrieval/,
      }),
    ).toBeTruthy();
    fireEvent.click(archive);
    expect(document.getElementById("archive-list")?.hidden).toBe(true);
  });
  it("switches the scientific explanation and pauses animation", () => {
    render(<ScientificVisual />);
    const group = screen.getByRole("group", { name: "Illustration stage" });
    const signals = within(group).getByRole("button", { name: "01 Signals" });
    fireEvent.click(signals);
    expect(signals.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(
      /signal traces/,
    );
    const pause = screen.getByRole("button", {
      name: "Pause visual animation",
    });
    fireEvent.click(pause);
    expect(
      screen
        .getByRole("button", { name: "Play visual animation" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it.each(projects)("serves a complete detail page for $slug", (project) => {
    render(<App path={`/projects/${project.slug}/`} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      project.title,
    );
    expect(screen.getByText(project.contribution)).toBeTruthy();
    expect(screen.getByText(project.evidence)).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Scope & limitations." }),
    ).toBeTruthy();
    expect(
      screen
        .getAllByRole("link", { name: project.sourceLabel })
        .every((a) => a.getAttribute("href") === project.source),
    ).toBe(true);
  });
  it("opens an experience reached through an organization anchor", () => {
    render(<App />);
    const detail = document.getElementById(
      "experience-magyar",
    ) as HTMLDetailsElement;
    expect(detail.open).toBe(false);
    window.history.replaceState(null, "", "#experience-magyar");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(detail.open).toBe(true);
    window.history.replaceState(null, "", "/");
  });

  it("closes organization details from the keyboard and restores the triggering logo", () => {
    render(<App />);
    const logo = screen.getByRole("button", {
      name: "ENSISA — Engineering degree",
    });
    fireEvent.click(logo);
    const panel = document.getElementById(logo.getAttribute("aria-controls")!)!;
    expect(panel.getAttribute("aria-hidden")).toBe("false");
    const link = within(panel).getByRole("link", { name: "View education" });
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(document.activeElement).toBe(logo);
    expect(logo.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("inert")).toBe(true);
    expect(screen.queryByRole("link", { name: "View education" })).toBeNull();
  });
  it("reserves all organization panels without exposing inactive actions", () => {
    render(<App />);
    const panels = document.querySelectorAll(".org-detail");
    expect(panels.length).toBe(4);
    fireEvent.click(
      screen.getByRole("button", { name: "MAGYAR SA — Applied ML project" }),
    );
    expect(
      [...panels].filter((p) => p.getAttribute("aria-hidden") === "false")
        .length,
    ).toBe(1);
    expect([...panels].filter((p) => p.hasAttribute("inert")).length).toBe(3);
    fireEvent.click(
      screen.getByRole("button", { name: "Close organization details" }),
    );
    expect(screen.queryByRole("link", { name: "View experience" })).toBeNull();
  });
  it("suspends the scientific animation in a hidden tab while preserving manual pause", () => {
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const { container } = render(<ScientificVisual />);
    const figure = container.querySelector("figure")!;
    hidden.mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(figure.classList.contains("visual-paused")).toBe(true);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    expect(figure.classList.contains("visual-paused")).toBe(false);
    fireEvent.click(
      screen.getByRole("button", { name: "Pause visual animation" }),
    );
    fireEvent(document, new Event("visibilitychange"));
    expect(figure.classList.contains("visual-paused")).toBe(true);
    hidden.mockRestore();
  });
  it("returns a useful not-found page for unknown paths", () => {
    render(<App path="/does-not-exist/" />);
    expect(
      screen
        .getByRole("link", { name: "Back to the portfolio" })
        .getAttribute("href"),
    ).toBe("/");
  });
  it("does not turn event contacts into professional affiliations or forks into claimed work", () => {
    render(<App />);
    const org = document.getElementById("organizations")!;
    expect(org.textContent).not.toMatch(/Roche|Novartis|Google|EPAM/);
    expect(projects.map((p) => p.slug)).not.toContain("drjit");
  });
});
