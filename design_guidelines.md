# Kube Credential - Design Guidelines

## Design Approach: Design System (Material Design + Developer-Focused)

**Rationale:** This is a utility-focused, technical credential management system requiring clarity, trust, and efficiency. Material Design's structured approach combined with developer tool aesthetics (Linear/GitHub-inspired) provides the optimal foundation.

**Key Design Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Technical confidence: Professional, trustworthy appearance for credential handling
- Immediate feedback: Clear success/error states with minimal visual noise
- Data-first: JSON and technical information take center stage

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: `222 15% 10%` (deep charcoal)
- Surface: `222 15% 15%` (elevated panels)
- Surface elevated: `222 15% 18%` (cards, modals)
- Primary: `217 91% 60%` (confident blue - trust/security)
- Success: `142 71% 45%` (credential issued)
- Error: `0 84% 60%` (verification failed)
- Warning: `38 92% 50%` (duplicate detected)
- Text primary: `0 0% 95%`
- Text secondary: `0 0% 65%`
- Border: `222 15% 25%`

**Light Mode:**
- Background: `0 0% 98%`
- Surface: `0 0% 100%`
- Primary: `217 91% 50%`
- Success: `142 71% 40%`
- Error: `0 84% 55%`
- Text primary: `222 15% 15%`
- Text secondary: `222 10% 45%`

### B. Typography

**Font Stack:**
- Primary: `'Inter', -apple-system, sans-serif` (UI text)
- Monospace: `'JetBrains Mono', 'Fira Code', monospace` (JSON display, worker IDs)

**Type Scale:**
- Hero/Page Title: `text-4xl font-bold` (36px)
- Section Headers: `text-2xl font-semibold` (24px)
- Card Titles: `text-lg font-medium` (18px)
- Body Text: `text-base` (16px)
- Labels: `text-sm font-medium uppercase tracking-wide` (14px)
- Code/JSON: `text-sm font-mono` (14px)
- Captions: `text-xs text-secondary` (12px)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of **4, 6, 8, 12** consistently
- Component padding: `p-6` or `p-8`
- Section spacing: `space-y-8` or `space-y-12`
- Card gaps: `gap-6`
- Form fields: `space-y-4`

**Grid Structure:**
- Container: `max-w-6xl mx-auto px-4`
- Two-page split: Single column focus (no side-by-side unless comparison view)
- Each page occupies full container width with centered cards

### D. Component Library

**Navigation:**
- Top navigation bar with logo, page tabs (Issuance | Verification), minimal design
- Active tab: Subtle bottom border in primary color
- Height: `h-16` with subtle border-bottom

**Core Components:**

1. **Credential Input Panel** (Issuance Page)
   - Bordered card with `border-2` in surface color
   - JSON editor area: Dark code editor aesthetic with syntax highlighting feel
   - Textarea with monospace font, min height `min-h-64`
   - Submit button: Large, primary, full-width or prominent placement
   - Clear/Reset button: Secondary, ghost style

2. **Response Display Panel**
   - Success state: Green-tinted border `border-l-4 border-success`
   - Error state: Red-tinted border `border-l-4 border-error`
   - Worker ID badge: `bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-mono`
   - Timestamp: Small, secondary text with clock icon
   - JSON output: Code block with copy button, syntax highlighting

3. **Verification Input Panel**
   - Similar to issuance but with verify button in different color scheme
   - Paste credential JSON area
   - Instant validation feedback

4. **Status Cards**
   - Icon + Status text + Detail message
   - Icons: Check circle (success), X circle (error), Alert triangle (warning)
   - Subtle background tint matching status color at 10% opacity

5. **Worker Information Badge**
   - Format: `"🔧 worker-{n}"` or `"⚙️ Handled by: worker-{n}"`
   - Appears in both success and error responses
   - Monospace font for worker ID

**Form Elements:**
- Input fields: `border border-border rounded-lg p-3`
- Focus states: `ring-2 ring-primary/50`
- Labels: Uppercase, small, medium weight, secondary color
- Dark mode: Inputs with `bg-surface` background

**Buttons:**
- Primary: `bg-primary text-white hover:bg-primary/90` large padding `px-8 py-3`
- Secondary: `border-2 border-primary text-primary hover:bg-primary/10`
- Danger: `bg-error text-white` for reset/clear actions
- All buttons: `rounded-lg font-medium transition-all duration-200`

**Data Display:**
- JSON blocks: `bg-black/50 border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto`
- Copy button overlay: Top-right corner, ghost style, appears on hover
- Line numbers: Optional, in secondary color

### E. Page-Specific Layouts

**Issuance Page:**
- Hero section: `h-32` with gradient background, page title, brief description
- Main content: Two-column desktop (`grid-cols-1 lg:grid-cols-2 gap-8`)
  - Left: Input panel for credential JSON
  - Right: Response/result display (appears after submission)
- Mobile: Stacked single column

**Verification Page:**
- Similar structure to Issuance
- Additional: History panel showing recent verifications (optional enhancement)
- Visual distinction: Verification uses secondary color accent vs primary for issuance

**Empty States:**
- Center-aligned icon (document icon)
- "No credentials issued yet" or "Enter credential to verify"
- Helpful text prompting user action
- Subtle background pattern (dots or grid, very low opacity)

### F. Micro-interactions

**Minimal, Purposeful Animations:**
- Form submission: Button loading spinner only
- Success/Error: Subtle slide-in from top for status messages (200ms)
- Copy to clipboard: Brief checkmark replacement (1s)
- NO page transitions, hover effects, or decorative animations

**Loading States:**
- Inline spinner in button during API call
- Skeleton screens NOT used (direct show/hide content)
- Progress indicators only if operation exceeds 1s

### G. Error Handling & Feedback

**Visual Hierarchy:**
1. Toast notification for system errors (top-center, auto-dismiss 4s)
2. Inline error messages below inputs for validation
3. Response panel error states for API failures

**Error Message Format:**
- Icon + Error title (bold)
- Detailed message (secondary text)
- Action suggestion if applicable
- Worker ID always shown even in errors

---

## Images & Visual Assets

**No Hero Images Required** - This is a utility application where function takes precedence.

**Icons:**
- Use Heroicons (outline style) via CDN
- Key icons needed: CheckCircle, XCircle, ExclamationTriangle, Clipboard, Code, Server, Clock
- Size: `w-5 h-5` for inline, `w-8 h-8` for status displays

**Illustration/Empty States:**
- Simple SVG illustrations for empty credential lists (document/folder icon)
- Subtle, monochromatic to match dark theme

---

## Production Excellence Checklist

- Responsive breakpoints: Mobile-first, tablet adjustments at `md:`, desktop at `lg:`
- Dark mode as default, light mode toggle in nav (optional)
- Keyboard navigation: Full tab support, enter to submit
- ARIA labels on all interactive elements
- High contrast ratios: 4.5:1 minimum for text
- Monospace fonts render consistently across all JSON displays
- Copy-paste functionality tested extensively
- Loading states prevent double submissions