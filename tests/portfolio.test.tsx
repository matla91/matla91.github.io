import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
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
