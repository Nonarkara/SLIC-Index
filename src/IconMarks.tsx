/**
 * Line-art marks for the hero console.
 *
 * The hero used to be three filled and outlined boxes stacked on a
 * photograph, then a separate row of three statistics. Nine rectangles
 * saying two things. It is now one strip: a mark and a label for each
 * action, a figure and a label for each fact, all on one baseline under a
 * single rule.
 *
 * These are the marks. They are drawn, not typed, so the strip reads as
 * symbols beside numbers rather than as another row of boxes. Each is a
 * 20×20 line drawing on `currentColor` with no fill of its own — the mark
 * inherits the tone of the cell it sits in.
 */

/** A board of city blocks. Used for "see every city". */
export function CityBoardMark() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <rect x="1.8" y="1.8" width="4.4" height="4.4" />
      <rect x="7.8" y="1.8" width="4.4" height="4.4" />
      <rect x="13.8" y="1.8" width="4.4" height="4.4" />
      <rect x="1.8" y="7.8" width="4.4" height="4.4" />
      <rect x="7.8" y="7.8" width="4.4" height="4.4" />
      <rect x="13.8" y="7.8" width="4.4" height="4.4" />
      <rect x="1.8" y="13.8" width="4.4" height="4.4" />
      <rect x="7.8" y="13.8" width="4.4" height="4.4" />
      <rect x="13.8" y="13.8" width="4.4" height="4.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A graticule globe. Used for "open the world map". */
export function GlobeMark() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <circle cx="10" cy="10" r="8.1" />
      <ellipse cx="10" cy="10" rx="3.5" ry="8.1" />
      <path d="M1.9 10h16.2" />
      <path d="M3.7 5.6h12.6M3.7 14.4h12.6" />
    </svg>
  );
}

/** Two bars of unequal height on an axis. Used for "compare with other indices". */
export function CompareMark() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
      <path d="M2.4 2.6v14.9h15.2" strokeLinecap="round" />
      <rect x="5" y="9.8" width="3.4" height="7.7" />
      <rect x="11.2" y="4.6" width="3.4" height="12.9" />
    </svg>
  );
}

/**
 * An arrow leaving a box. Used for "opens somewhere else".
 *
 * This was a typed "↗" before. The arrow was a real symbol, but a typed
 * symbol is still a character in the text flow: it takes the line's font, it
 * cannot be sized or aligned with the mark beside it, and it reads as an
 * emoji to any linter that counts pictographs. Drawn, it belongs to the same
 * set as the other marks and inherits the cell's colour.
 */
export function ExternalLinkMark() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.4 2.9h5.7v5.7" />
      <path d="M17.1 2.9 9.6 10.4" />
      <path d="M15.4 11.9v4.6a1.6 1.6 0 0 1-1.6 1.6H3.9a1.6 1.6 0 0 1-1.6-1.6V6.2a1.6 1.6 0 0 1 1.6-1.6h4.6" />
    </svg>
  );
}
