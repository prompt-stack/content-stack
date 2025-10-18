# Header Dropdown Implementation Plan

## Task Overview
Update the existing Header component to match the cleaner dropdown design from the HTML mockup, incorporating user info, theme toggle, and better visual hierarchy.

## Implementation Plan

### 1. **Update Header Component** (`src/components/Header.tsx`)
- Replace current profile dropdown trigger with cleaner "Menu" button design
- Add chevron icon that rotates when dropdown is open
- Maintain existing navigation structure
- Keep responsive behavior

### 2. **Create New Dropdown Content Components**

#### **UserInfoSection Component**
```typescript
// New component in Header.tsx or separate file
interface UserInfoSectionProps {
  email: string;
  tier: 'free' | 'pro' | 'enterprise';
}
```
- Display user email
- Show tier badge with appropriate styling
- Located at top of dropdown

#### **ThemeToggleSection Component**
```typescript
// Integrated theme toggle in dropdown
interface ThemeToggleSectionProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}
```
- Light/Dark toggle buttons
- Active state indicator
- Smooth transition animations

### 3. **Update Dropdown Menu Structure**
```
Dropdown Menu
├── User Info Section
│   ├── Email display
│   └── Tier badge
├── Theme Section
│   ├── Label "THEME"
│   └── Toggle buttons (Light/Dark)
├── Divider
└── Menu Items
    ├── Settings
    ├── Manage Subscription
    └── Logout
```

### 4. **Style Updates**

#### **CSS Variables to Add/Update**
```css
--primary-alpha: rgba(37, 99, 235, 0.1);  /* For tier badge background */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

#### **New CSS Classes**
- `.menu-trigger` - Clean button styling with border
- `.menu-trigger-arrow` - Rotating chevron icon
- `.user-info-section` - User info container
- `.tier-badge` - Styled tier indicator
- `.theme-section` - Theme toggle container
- `.theme-toggle` - Toggle button group
- `.theme-option` - Individual theme buttons

### 5. **Update Existing Hooks/Context**

#### **useTheme Hook Updates**
- Move theme state management to this hook if not already there
- Expose `currentTheme` and `setTheme` functions
- Ensure theme persistence in localStorage

#### **User Context (New)**
```typescript
interface UserContextValue {
  user: {
    email: string;
    tier: 'free' | 'pro' | 'enterprise';
  } | null;
}
```
- Create if doesn't exist
- Mock data for now: `{ email: 'user@example.com', tier: 'pro' }`

### 6. **Functions to Implement**

#### **handleThemeChange**
```typescript
const handleThemeChange = (theme: 'light' | 'dark') => {
  setTheme(theme);
  // Update CSS class on document.body
  // Save to localStorage
}
```

#### **handleLogout**
```typescript
const handleLogout = () => {
  // Clear user data
  // Redirect to login/home
  console.log('Logout clicked');
}
```

#### **handleManageSubscription**
```typescript
const handleManageSubscription = () => {
  // Navigate to subscription page
  // Or open external billing portal
  console.log('Manage subscription clicked');
}
```

### 7. **Component Structure**

```typescript
// Updated Header.tsx structure
export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useUser(); // Mock for now
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Existing brand and navigation */}
          
          {/* New dropdown trigger */}
          <div className="menu-dropdown">
            <button 
              className="menu-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <span>Menu</span>
              <i className={`fas fa-chevron-down menu-trigger-arrow`} />
            </button>
            
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              {/* User info */}
              <div className="user-info-section">
                <div className="user-email">{user?.email || 'user@example.com'}</div>
                <span className="tier-badge">{user?.tier || 'Pro'} Plan</span>
              </div>
              
              {/* Theme toggle */}
              <div className="theme-section">
                <label className="theme-label">THEME</label>
                <div className="theme-toggle">
                  <button 
                    className={`theme-option ${theme === 'light' ? 'theme-option--active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <i className="fas fa-sun" />
                    <span>Light</span>
                  </button>
                  <button 
                    className={`theme-option ${theme === 'dark' ? 'theme-option--active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <i className="fas fa-moon" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
              
              <div className="menu-divider" />
              
              {/* Menu items */}
              <div className="menu-section">
                <button className="menu-item" onClick={() => navigate('/settings')}>
                  <i className="fas fa-cog" />
                  <span>Settings</span>
                </button>
                <button className="menu-item" onClick={handleManageSubscription}>
                  <i className="fas fa-crown" />
                  <span>Manage Subscription</span>
                </button>
                <button className="menu-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt" />
                  <span>Logout</span>
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
```

## Implementation Steps

1. **Create User Context/Hook** (if needed)
   - Mock user data for now
   - Add email and tier information

2. **Update useTheme Hook**
   - Ensure proper theme state management
   - Add theme persistence

3. **Update Header Component**
   - Replace profile dropdown with new menu dropdown
   - Add user info section
   - Integrate theme toggle
   - Update menu items

4. **Add CSS Styles**
   - Add new CSS variables
   - Style new components
   - Ensure responsive behavior

5. **Test Implementation**
   - Verify dropdown opens/closes
   - Test theme switching
   - Check responsive behavior
   - Ensure all menu items have appropriate handlers

## Benefits

1. **Cleaner UI** - More professional appearance
2. **Better UX** - User info visible at top
3. **Integrated Theme Toggle** - No separate toggle needed
4. **Scalable** - Easy to add more menu items
5. **Consistent** - Follows design system patterns

## Future Enhancements

1. Add real authentication/user data
2. Implement actual logout functionality
3. Add notification badges
4. Include user avatar support
5. Add keyboard navigation support