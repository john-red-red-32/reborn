"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import styles from "./AnalyticsConsent.module.css";

const MEASUREMENT_ID = "G-PTENZWZFC1";
const STORAGE_KEY = "reborna-analytics-consent-v1";
const SETTINGS_EVENT = "reborna:analytics-preferences";
const SCRIPT_ID = "reborna-ga4";
type Choice = "accepted" | "rejected";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

function readChoice(): Choice | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as {choice?: string} | null;
    return stored?.choice === "accepted" || stored?.choice === "rejected" ? stored.choice : null;
  } catch {
    return null;
  }
}

function startAnalytics() {
  if (document.getElementById(SCRIPT_ID)) return;
  // Withhold the tag entirely until the visitor has affirmatively opted in.
  const win = window as AnalyticsWindow;
  (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = false;
  win.dataLayer = win.dataLayer || [];
  win.gtag = (...args: unknown[]) => { win.dataLayer?.push(args); };
  win.gtag("js", new Date());
  win.gtag("config", MEASUREMENT_ID);
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function stopAnalytics() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  document.getElementById(SCRIPT_ID)?.remove();
  // Removing the script does not unload a script already executed. The page
  // is reloaded after withdrawal, and first-party GA cookies are cleared.
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const domain of ["", "; domain=.reborna.co"]) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain}`;
    }
  }
}

export function AnalyticsSettingsButton() {
  return <button type="button" className={styles.settingsButton} onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>Analytics choices</button>;
}

export default function AnalyticsConsent() {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readChoice();
    setChoice(saved);
    setOpen(!saved);
    setReady(true);
    const showSettings = () => setOpen(true);
    window.addEventListener(SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, showSettings);
  }, []);

  useEffect(() => {
    if (ready && choice === "accepted") startAnalytics();
  }, [ready, choice]);

  const decide = (next: Choice) => {
    const previouslyAccepted = choice === "accepted";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({choice: next, updatedAt: new Date().toISOString()}));
    } catch {
      // Blocked storage must never accidentally authorise tracking.
      if (next === "accepted") return;
    }
    if (next === "rejected" && previouslyAccepted) {
      stopAnalytics();
      window.location.reload();
      return;
    }
    setChoice(next);
    setOpen(false);
  };

  if (!ready || !open) return null;
  return <section className={styles.banner} role="region" aria-label="Analytics privacy choices">
    <div className={styles.copy}>
      <span className={styles.eyebrow}>A NOTE ABOUT PRIVACY</span>
      <h2>May we use analytics?</h2>
      <p>We'd love to understand how visitors discover Reborna. With your permission, Google Analytics uses cookies to measure visits and site activity. It's optional; rejecting won't affect your experience. <Link href="/cookies/">Learn more</Link>.</p>
    </div>
    <div className={styles.actions}>
      <button type="button" className={styles.reject} onClick={() => decide("rejected")}>Reject analytics</button>
      <button type="button" className={styles.accept} onClick={() => decide("accepted")}>Accept analytics</button>
      {choice && <button type="button" className={styles.close} onClick={() => setOpen(false)}>Keep current choice</button>}
    </div>
  </section>;
}
