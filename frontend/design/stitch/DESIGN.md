---
name: The Living Research Index
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd7ed'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f1ff'
  surface-container: '#f0ebff'
  surface-container-high: '#ebe5fb'
  surface-container-highest: '#e5e0f6'
  on-surface: '#1c1a29'
  on-surface-variant: '#4b444f'
  inverse-surface: '#312e3f'
  inverse-on-surface: '#f3eeff'
  outline: '#7c7480'
  outline-variant: '#cdc3d0'
  surface-tint: '#714f94'
  primary: '#48276a'
  on-primary: '#ffffff'
  primary-container: '#603f83'
  on-primary-container: '#d7b0fe'
  inverse-primary: '#dcb8ff'
  secondary: '#415d9a'
  on-secondary: '#ffffff'
  secondary-container: '#a0bafe'
  on-secondary-container: '#2d4985'
  tertiary: '#5a2a03'
  on-tertiary: '#ffffff'
  tertiary-container: '#764018'
  on-tertiary-container: '#fbaf7d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#efdbff'
  primary-fixed-dim: '#dcb8ff'
  on-primary-fixed: '#2a054c'
  on-primary-fixed-variant: '#58377b'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b0c6ff'
  on-secondary-fixed: '#001945'
  on-secondary-fixed-variant: '#284580'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#6d3911'
  background: '#fcf8ff'
  on-background: '#1c1a29'
  surface-variant: '#e5e0f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  display-lg-th:
    fontFamily: Kanit
    fontSize: 52px
    fontWeight: '700'
    lineHeight: '1.4'
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h1-th:
    fontFamily: Kanit
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.5'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  h2-th:
    fontFamily: Kanit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.6'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-lg-th:
    fontFamily: Kanit
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.8'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md-th:
    fontFamily: Kanit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm-th:
    fontFamily: Kanit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  index_rail_width: 64px
  gutter: 24px
  margin_mobile: 16px
  margin_desktop: 48px
  section_gap: 80px
---

## Brand & Style

The design system is built upon the "Living Research Index" narrative—a bridge between the tactile heritage of a university library and the efficiency of a contemporary digital archive. The personality is **intelligent, calm, and highly credible**, prioritizing clarity of information over decorative flourish.

The visual style is **Editorial Modernism**. It rejects common SaaS abstractions in favor of a structured, grid-based layout reminiscent of an academic journal. The aesthetic is defined by:
- **Sophisticated Intellect:** Using archival elements like margin notes, brackets, and folio numbers to ground the digital experience in physical research traditions.
- **Academic Serenity:** A warm, paper-inspired foundation that reduces eye strain during long-form reading and data synthesis.
- **Thai-Centric Legibility:** A conscious balancing of Thai and Latin scripts to ensure a unified editorial voice across bilingual content.

## Colors

The palette is rooted in the "Deep Mulberry" primary, conveying authority and depth. This is supported by a dual-tone "Scholarly Periwinkle" range that handles secondary actions and categorization without the harshness of standard blue.

- **Foundational Surfaces:** Use `Warm Paper` as the global background to evoke physical stock.
- **Functional Tinting:** `Soft Lavender`, `Powder Blue`, and `Apricot Wash` are utilized for semantic grouping and archive categorization.
- **Accents:** `Soft Apricot` is reserved for "New" indicators, archive tags, and high-priority callouts to provide warmth against the cooler purples and blues.
- **Contrast:** High-contrast `Ink` ensures maximum readability for body text, while `Dusty Gray` is used for meta-data, citations, and secondary margin notes.

## Typography

This design system employs a bilingual typographic scale. For English, **Plus Jakarta Sans** provides a clean, modern geometric feel that balances the warmth of the colors. For Thai, **Kanit** is used for its exceptional clarity and professional weight distribution.

**Critical Formatting Rules:**
- **The 110% Rule:** Thai characters possess vertical complexity. Always scale Thai text ~10-12% larger than the equivalent English role and increase line-height by at least 0.2 to prevent "vowel crashing."
- **Editorial Accents:** Use monospaced numbers (or tabular lining) for document reference codes and page numbers.
- **Margins & Brackets:** Secondary information (like citations) should be wrapped in brackets `[Ref: 001]` or placed in a narrow right-side margin column.

## Layout & Spacing

The layout is inspired by editorial spreads. It utilizes a **12-column grid** on desktop with a specialized **Research Index Rail** on the far left.

- **Research Index Rail:** A slim 64px vertical strip containing iconic navigation and current section indicators. It remains fixed while content scrolls.
- **The Editorial Margin:** On desktop, the central 8 columns are used for primary reading, while the outer 4 columns are reserved for "Citation Connections" (thin lines showing related papers) and margin notes.
- **Mobile Reflow:** The vertical rail converts to a bottom-fixed navigation bar. Margins compress to 16px.
- **Vertical Rhythm:** Use generous whitespace (section gaps of 80px+) between major research blocks to maintain an atmosphere of calm and focus.

## Elevation & Depth

The design system minimizes the use of heavy shadows to maintain its "printed paper" aesthetic. Depth is achieved through **Tonal Layering** rather than light source simulation.

- **Standard Elevation:** Only used for active Folio Cards and interactive dropdowns: `0 8px 24px rgba(38, 36, 52, 0.06)`. It should feel like a light lift, not a floating object.
- **Restrained Lines:** Use 1px rules in `Dusty Gray` (at 20% opacity) to separate header regions and footer notes.
- **Citation Connections:** Use ultra-thin (0.5px - 1px) lines to connect related data points. These represent the "living" aspect of the index, showing how research is intertwined.

## Shapes

The shape language is varied to differentiate between functional UI and content containers. 

- **Functional Elements:** Buttons and inputs use a moderate 12px radius for a soft, approachable feel.
- **Content Containers:** Standard cards use 16px, while featured "Hero" research entries use 20px-24px to feel more distinct and special.
- **Archive Tabs:** Small library-style tags use a tighter 8px radius to mimic the look of physical card-catalog tabs.

## Components

### Research Folio Cards
The core data container. It must include:
- A document reference number (e.g., `ML-2024-08`) in the top right.
- A "Archive Tab" in the top left indicating the category (Lavender for Social Science, Powder Blue for Tech, etc.).
- A clean editorial title using `h2` or `h2-th`.

### Archive Tabs
Small, rectangular badges with slightly rounded corners (8px). They use high-contrast text against soft wash backgrounds (e.g., Ink text on Apricot Wash background).

### Buttons & Inputs
- **Primary Action:** Deep Mulberry background with White text.
- **Secondary Action:** Ghost style with a Scholarly Periwinkle border (1px).
- **Inputs:** Soft Lavender background with a subtle 1px border that darkens on focus.

### Citation Connection Motif
A unique decorative but functional element. When a user hovers over a research link, a thin line should draw itself to the related citation in the margin, ending in a small 4px solid node.

### Editorial Details
- **Brackets:** Always use `[ ]` for metadata like date published or citation count.
- **Rules:** Vertical 1px lines should be used to separate the Index Rail from the main content.