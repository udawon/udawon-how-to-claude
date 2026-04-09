"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      run: () => Promise<void>;
    };
  }
}

function getThemeVariables(isDark: boolean) {
  if (isDark) {
    return {
      primaryColor: "#FB923C",
      primaryTextColor: "#EEEEE8",
      primaryBorderColor: "#FB923C",
      secondaryColor: "#242422",
      secondaryTextColor: "#A0A098",
      secondaryBorderColor: "#2E2E2B",
      tertiaryColor: "#1E1E1C",
      tertiaryTextColor: "#A0A098",
      tertiaryBorderColor: "#2E2E2B",
      lineColor: "#6C6C66",
      textColor: "#EEEEE8",
      mainBkg: "#1E1E1C",
      nodeBorder: "#FB923C",
      clusterBkg: "#181816",
      clusterBorder: "#2E2E2B",
      titleColor: "#EEEEE8",
      edgeLabelBackground: "#181816",
      nodeTextColor: "#EEEEE8",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      fontSize: "14px",
    };
  }
  return {
    primaryColor: "#C2410C",
    primaryTextColor: "#FFFFFF",
    primaryBorderColor: "#C2410C",
    secondaryColor: "#FFF3EB",
    secondaryTextColor: "#5C5C58",
    secondaryBorderColor: "#E2E0DB",
    tertiaryColor: "#F5F4F1",
    tertiaryTextColor: "#5C5C58",
    tertiaryBorderColor: "#E2E0DB",
    lineColor: "#9C9C96",
    textColor: "#1C1C1A",
    mainBkg: "#FFF3EB",
    nodeBorder: "#C2410C",
    clusterBkg: "#F8F8F6",
    clusterBorder: "#E2E0DB",
    titleColor: "#1C1C1A",
    edgeLabelBackground: "#F8F8F6",
    nodeTextColor: "#1C1C1A",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
    fontSize: "14px",
  };
}

export function MermaidInit() {
  useEffect(() => {
    const mermaidElements = document.querySelectorAll("pre.mermaid");
    if (mermaidElements.length === 0) return;

    const initAndRun = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      window.mermaid!.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: getThemeVariables(isDark),
      });
      window.mermaid!.run();
    };

    if (window.mermaid) {
      initAndRun();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = initAndRun;
    document.head.appendChild(script);
  }, []);

  return null;
}
