# WhatsApp Bot Management Platform Design Guidelines

## Design Approach
**Selected Approach**: Design System Approach using Material Design
**Justification**: This is a utility-focused application for managing WhatsApp bot sessions with admin functions. Material Design provides excellent patterns for data-heavy interfaces and clear hierarchical information display.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 216 100% 53% (Material Blue)
- Dark Mode: 216 84% 65% (Lighter blue for contrast)

**Surface Colors:**
- Light backgrounds: 0 0% 98%
- Dark backgrounds: 220 13% 9%
- Error states: 0 84% 60%
- Success states: 142 71% 45%

### B. Typography
**Primary Font**: Inter via Google Fonts
- Headers: 600 weight, sizes from text-lg to text-3xl
- Body text: 400 weight, text-sm to text-base
- Code/numbers: JetBrains Mono for phone numbers and session IDs

### C. Layout System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16
- Container padding: p-6
- Card spacing: p-4
- Button padding: px-4 py-2
- Section gaps: gap-8

### D. Component Library

**Navigation**
- Top navigation bar with logo and admin toggle
- Sidebar for mobile navigation
- Breadcrumbs for admin sections

**Data Display**
- Cards for session information with status indicators
- Tables for blocklist with action buttons
- Status badges (Connected/Disconnected, Blocked/Active)
- Phone number formatting with country code display

**Forms & Actions**
- Number input with validation
- Action buttons: Block, Unblock, Delete, Pair
- Confirmation modals for destructive actions
- Success/error toast notifications

**Dashboard Cards**
- Session status overview
- Active connections count
- Recent pairing activities
- Quick action buttons

### E. Page-Specific Guidelines

**Main Dashboard (`/`)**
- Hero section with pairing form prominently displayed
- Session cards grid showing active connections
- Blocklist display (read-only for users)
- Status indicators using Material Design color system

**Admin Panel (`/admin`)**
- Password protection or authentication gate
- Management actions clearly separated from viewing
- Confirmation dialogs for all destructive actions
- Audit log of recent admin activities

**Blocked User Page**
- Clean, informative message for banned users
- Contact developer information prominently displayed
- No administrative functions visible
- Professional tone with clear next steps

## Visual Hierarchy
- Primary actions (Pair, Connect) use filled buttons
- Secondary actions (View, Refresh) use outlined buttons
- Destructive actions (Delete, Block) use error colors
- Status information uses consistent badge patterns

## Responsive Design
- Mobile-first approach with stacked cards
- Desktop: Two-column layout with sidebar
- Tablet: Adaptive grid system
- Touch-friendly button sizes (44px minimum)

## Accessibility
- High contrast ratios in both light and dark modes
- Screen reader labels for all interactive elements
- Keyboard navigation support
- Focus indicators following Material Design patterns

This design system prioritizes clarity, efficiency, and administrative control while maintaining a professional appearance suitable for a bot management platform.