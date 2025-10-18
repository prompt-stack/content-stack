# Header Dropdown Implementation - Todo List

## Overview
Implement a dynamic, clean dropdown menu for the header component with user info, theme toggle, and action items. No hardcoded values - everything should be dynamic and data-driven.

## Todo List

### 🔴 High Priority

#### 1. **Check existing Header component structure and dependencies**
- [ ] Review current Header.tsx implementation
- [ ] Check existing dropdown usage
- [ ] Identify current theme toggle implementation
- [ ] Note any existing user/auth patterns

#### 2. **Create useUser hook for dynamic user data**
- [ ] Create hooks/useUser.ts
- [ ] Define UserData interface
- [ ] Implement mock data provider (to be replaced with real API later)
- [ ] Add user tier system (free, pro, enterprise)
- [ ] Export hook with proper types

#### 3. **Update useTheme hook for proper theme management**
- [ ] Check if useTheme exists, create if needed
- [ ] Implement theme persistence in localStorage
- [ ] Add theme change handlers
- [ ] Ensure proper TypeScript types
- [ ] Export current theme state

#### 6. **Update Header component with new dropdown structure**
- [ ] Replace existing dropdown trigger with Menu button
- [ ] Integrate UserInfoSection
- [ ] Integrate ThemeToggleSection  
- [ ] Add menu items dynamically
- [ ] Connect all handlers

### 🟡 Medium Priority

#### 4. **Create UserInfoSection component with dynamic data**
- [ ] Create component with TypeScript interface
- [ ] Accept user data as props
- [ ] Display email dynamically
- [ ] Show tier badge with dynamic styling
- [ ] Handle loading/null states

#### 5. **Create ThemeToggleSection component**
- [ ] Create component with theme props
- [ ] Implement toggle button group
- [ ] Add active state styling
- [ ] Connect to theme change handler
- [ ] Add smooth transitions

#### 7. **Add CSS styles for new dropdown components**
- [ ] Add new CSS variables to globals.css
- [ ] Create styles for menu-trigger
- [ ] Style user info section
- [ ] Style theme toggle section
- [ ] Ensure responsive behavior

### 🟢 Low Priority

#### 8. **Implement menu action handlers**
- [ ] Create handleSettingsClick (navigate to /settings)
- [ ] Create handleSubscriptionClick (placeholder)
- [ ] Create handleLogoutClick (placeholder)
- [ ] Add proper TypeScript types
- [ ] Connect to navigation

#### 9. **Test dropdown functionality and responsive behavior**
- [ ] Test dropdown open/close
- [ ] Verify theme switching works
- [ ] Check mobile responsive behavior
- [ ] Test keyboard navigation (optional)
- [ ] Verify all states work correctly

## Architecture Decisions

### Dynamic Data Sources
1. **User Data**: `useUser()` hook provides:
   ```typescript
   {
     email: string;
     tier: 'free' | 'pro' | 'enterprise';
     avatar?: string;
   }
   ```

2. **Menu Items**: Dynamic array:
   ```typescript
   const menuItems = [
     { icon: 'cog', label: 'Settings', action: handleSettingsClick },
     { icon: 'crown', label: 'Manage Subscription', action: handleSubscriptionClick },
     { icon: 'sign-out-alt', label: 'Logout', action: handleLogoutClick }
   ];
   ```

3. **Theme Options**: Dynamic configuration:
   ```typescript
   const themeOptions = [
     { value: 'light', icon: 'sun', label: 'Light' },
     { value: 'dark', icon: 'moon', label: 'Dark' }
   ];
   ```

### Component Relationships
```
Header
├── Navigation (existing)
├── MenuDropdown
│   ├── MenuTrigger
│   └── Dropdown (existing component)
│       ├── UserInfoSection
│       ├── ThemeToggleSection
│       └── MenuItemsList
```

## Next Steps
Start with Todo #1 - examining the existing Header component to understand the current implementation before making changes.