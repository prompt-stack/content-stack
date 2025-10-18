# Complete Header Implementation Plan

## Overview
Implement a full header design for the React app that includes brand/logo, navigation links, and the dropdown menu we already created. The design should match the clean, professional look from the HTML mockup.

## Current State
- ✅ Dropdown menu with user info and theme toggle is complete
- ❌ Missing brand/logo section
- ❌ Missing integrated navigation links
- ❌ Missing proper layout and responsive behavior

## Design Structure

```
Header
├── Brand Section (Left)
│   ├── Logo Icon (fa-layer-group)
│   └── Brand Text "Content Stack"
├── Navigation (Center-Left)
│   ├── Inbox (with icon)
│   ├── Library (with icon)
│   └── Search (with icon)
└── Actions (Right)
    ├── Health Button (optional)
    └── Menu Dropdown (already implemented)
```

## Components & Functions

### 1. **Header Component Updates** (`src/components/Header.tsx`)

#### Brand Section
```typescript
interface BrandSectionProps {
  logoIcon: string;
  brandName: string;
  onClick?: () => void;
}
```

#### Navigation Items
```typescript
interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/inbox', label: 'Inbox', icon: 'inbox' },
  { path: '/library', label: 'Library', icon: 'book' },
  { path: '/search', label: 'Search', icon: 'search' }
];
```

#### Functions to Implement
- `handleBrandClick()` - Navigate to home/dashboard
- `isNavActive(path: string)` - Check if current route matches nav item

### 2. **CSS Classes (BEM-lite style)**

#### Layout Classes
- `.header` - Main header container
- `.header-container` - Max-width wrapper
- `.header-content` - Flex container for layout

#### Brand Classes
- `.header-brand` - Brand/logo link
- `.header-brand-icon` - Logo icon styling
- `.header-brand-text` - Brand name text

#### Navigation Classes
- `.header-nav` - Navigation container
- `.nav-link` - Individual nav links
- `.nav-link--active` - Active state
- `.nav-link-icon` - Nav item icons
- `.nav-link-text` - Nav item labels

#### Actions Classes
- `.header-actions` - Right-side actions container
- `.menu-dropdown` - Already implemented

### 3. **CSS Variables to Add**

```css
/* Add to existing variables */
--header-height: 64px;
--header-padding: 1rem;
--nav-gap: 0.5rem;
--brand-color: var(--primary);
```

### 4. **Responsive Breakpoints**

#### Tablet (768px - 1024px)
- Hide nav link text, show icons only
- Reduce spacing

#### Mobile (< 768px)
- Hide brand text, show icon only
- Show only essential nav items
- Compact menu trigger

### 5. **Data Attributes**

```html
<!-- For testing and state management -->
data-testid="header-brand"
data-testid="nav-inbox"
data-testid="nav-library"
data-testid="nav-search"
data-active="true|false"
```

## Implementation Steps

### Phase 1: Update Header Structure
1. Add brand section with logo and text
2. Move navigation from existing location to header
3. Ensure menu dropdown stays on the right

### Phase 2: Implement Navigation
1. Use NavLink from react-router-dom for active states
2. Add icons to each nav item
3. Implement active state styling

### Phase 3: Add Styling
1. Update header layout with flexbox
2. Add brand styling with hover effects
3. Style navigation with active indicators
4. Ensure existing dropdown styles work

### Phase 4: Responsive Design
1. Add media queries for tablet/mobile
2. Hide text labels on smaller screens
3. Adjust spacing and sizing
4. Test on different screen sizes

## Code Structure Example

```typescript
export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const { resolvedTheme, setTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navItems = [
    { path: '/inbox', label: 'Inbox', icon: 'inbox' },
    { path: '/library', label: 'Library', icon: 'book' },
    { path: '/search', label: 'Search', icon: 'search' }
  ]

  const handleBrandClick = () => {
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Brand */}
          <a 
            href="/" 
            className="header-brand"
            onClick={(e) => {
              e.preventDefault()
              handleBrandClick()
            }}
            data-testid="header-brand"
          >
            <i className="fas fa-layer-group header-brand-icon" />
            <span className="header-brand-text">Content Stack</span>
          </a>

          {/* Navigation */}
          <nav className="header-nav">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  clsx('nav-link', isActive && 'nav-link--active')
                }
                data-testid={`nav-${item.icon}`}
              >
                <i className={`fas fa-${item.icon} nav-link-icon`} />
                <span className="nav-link-text">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Optional Health Button */}
            {/* Menu Dropdown - Already implemented */}
          </div>
        </div>
      </div>
    </header>
  )
}
```

## Benefits of This Design

1. **Clean Layout** - Clear visual hierarchy
2. **Intuitive Navigation** - Easy to find main sections
3. **Responsive** - Works on all screen sizes
4. **Accessible** - Proper ARIA labels and keyboard navigation
5. **Extensible** - Easy to add new nav items or actions

## Testing Checklist

- [ ] Brand click navigates to home
- [ ] Navigation links show active state
- [ ] Dropdown menu opens/closes properly
- [ ] Theme switching works
- [ ] Responsive behavior on mobile
- [ ] Keyboard navigation works
- [ ] All icons load properly
- [ ] Smooth transitions and hover states