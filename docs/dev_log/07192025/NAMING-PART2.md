NAMING CONVENTION ENHANCEMENTS
===============================

🔍 MISSING AREAS TO ADD
===============================

### Animation/Transition Components
**Pattern**: `[AnimationType]` or `[AnimationType]Transition`
```typescript
// ✅ Correct (Primitive animations)
export const Spinner = () => { ... }
export const Pulse = () => { ... }
export const Skeleton = () => { ... }

// ✅ Correct (Transition utilities)  
export const FadeTransition = ({ children }) => { ... }
export const SlideTransition = ({ children }) => { ... }

// ❌ Incorrect
export const LoadingSpinner = () => { ... }  // Redundant 'Loading'
export const AnimationFade = () => { ... }   // Wrong order
```

### Prop Naming Conventions
**Pattern**: Semantic and consistent prop names
```typescript
// ✅ Correct
interface ButtonProps {
  variant?: 'primary' | 'secondary';     // Not 'type' or 'kind'
  size?: 'sm' | 'md' | 'lg';            // Not 'small' | 'medium'
  loading?: boolean;                      // Not 'isLoading'
  disabled?: boolean;                     // Not 'isDisabled'
  onClick?: () => void;                   // Not 'handleClick'
  children: React.ReactNode;              // Not 'content'
}

// ❌ Incorrect  
interface ButtonProps {
  type?: 'primary';                       // Use 'variant'
  isLoading?: boolean;                    // Use 'loading'
  content: React.ReactNode;               // Use 'children'
}
```

### Composition Component Naming
**Pattern**: `[ComponentName][ChildName]`
```typescript
// ✅ Correct (Card composition)
export const Card = () => { ... }
export const CardHeader = () => { ... }
export const CardBody = () => { ... }
export const CardFooter = () => { ... }

// ✅ Correct (Modal composition)
export const Modal = () => { ... }
export const ModalHeader = () => { ... }
export const ModalBody = () => { ... }
export const ModalFooter = () => { ... }

// ❌ Incorrect
export const CardTop = () => { ... }     // Use 'CardHeader'
export const ModalContent = () => { ... } // Use 'ModalBody'
```

### Context/Provider Naming
**Pattern**: `[FeatureName]Context` and `[FeatureName]Provider`
```typescript
// ✅ Correct
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => { ... }

export const ContentInboxContext = createContext();
export const ContentInboxProvider = ({ children }) => { ... }

// ❌ Incorrect
export const Theme = createContext();          // Missing 'Context'
export const ThemeCtx = createContext();       // Don't abbreviate
```

### Error Boundary Naming
**Pattern**: `[Scope]ErrorBoundary`
```typescript
// ✅ Correct
export class AppErrorBoundary extends Component { ... }
export class FeatureErrorBoundary extends Component { ... }
export class ComponentErrorBoundary extends Component { ... }

// ❌ Incorrect
export class ErrorBoundary extends Component { ... }  // Too generic
export class ErrorHandler extends Component { ... }   // Not a boundary
```

===============================

📝 ANTI-PATTERNS TO EXPLICITLY AVOID
===============================

### Component Anti-Patterns
```typescript
// ❌ Layer prefixes (redundant with folder structure)
export const PrimitiveButton = () => { ... }
export const ComposedSearchInput = () => { ... }
export const FeatureContentInbox = () => { ... }

// ❌ Technical prefixes  
export const UIButton = () => { ... }
export const BaseCard = () => { ... }
export const CoreInput = () => { ... }

// ❌ Generic suffixes
export const ButtonComponent = () => { ... }
export const CardElement = () => { ... }
export const InputWidget = () => { ... }

// ❌ Abbreviations
export const Btn = () => { ... }
export const Inp = () => { ... }
export const Nav = () => { ... }
```

### Function Anti-Patterns
```typescript
// ❌ Inconsistent event handlers
const onButtonClick = () => { ... }        // Use 'handleButtonClick'
const clickHandler = () => { ... }         // Use 'handleClick'
const buttonClicked = () => { ... }        // Use 'handleButtonClick'

// ❌ Unclear action verbs
const processData = () => { ... }          // Use 'parseData' or 'validateData'
const doSomething = () => { ... }          // Use specific verb
const handleStuff = () => { ... }          // Use specific noun
```

### Props Anti-Patterns
```typescript
// ❌ Technical props
interface ButtonProps {
  cssClass?: string;                      // Use 'className'
  styles?: CSSProperties;                 // Use 'style'
  ref?: React.Ref;                        // Use forwardRef pattern
}

// ❌ Redundant boolean prefixes
interface ComponentProps {
  isVisible?: boolean;                    // Use 'visible'
  isDisabled?: boolean;                   // Use 'disabled'
  hasError?: boolean;                     // Use 'error'
}
```

===============================

🎯 LLM-SPECIFIC GUIDANCE ADDITIONS
===============================

### Decision Tree Enhancement
```typescript
/**
 * LLM NAMING DECISION TREE:
 * 
 * 1. IDENTIFY COMPONENT PURPOSE:
 *    - Wraps HTML element 1:1? → Primitive (Button, Input)
 *    - Combines primitives? → Composed (SearchInput, DatePicker)  
 *    - Has business logic? → Feature ([FeatureName][Type])
 *    - Route component? → Page ([Name]Page)
 *    - State management? → Utility (use[Name])
 * 
 * 2. CHECK COMPOSITION:
 *    - Parent/child relationship? → [Parent] + [Parent][Child]
 *    - Animation/transition? → [Type] or [Type]Transition
 *    - Context provider? → [Name]Context + [Name]Provider
 * 
 * 3. APPLY FUNCTION PATTERNS:
 *    - User interaction? → handle[Event]
 *    - Data transformation? → [verb][Subject]
 *    - Condition check? → is[Condition] or has[Property]
 *    - Value computation? → get[Value] or calculate[Value]
 */
```

### Validation Checklist for LLMs
```typescript
/**
 * BEFORE CREATING A COMPONENT, CHECK:
 * 
 * ✅ Name follows layer pattern
 * ✅ No technical prefixes (UI, Base, Core)
 * ✅ No layer prefixes (Primitive, Composed)
 * ✅ Props interface uses [ComponentName]Props
 * ✅ Event handlers use handle[Event] pattern
 * ✅ Boolean functions use is/has pattern
 * ✅ File name matches component name
 * ✅ CSS classes follow conventions
 * ✅ No abbreviations or unclear terms
 */
```

===============================

📋 COMPLETE EXAMPLES BY COMPLEXITY
===============================

### Simple Primitive
```typescript
// File: /components/Badge.tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', children }, ref) => {
    return (
      <span 
        ref={ref} 
        className={`badge badge--${variant} badge--${size}`}
        data-cid="Badge"
      >
        {children}
      </span>
    );
  }
);
```

### Complex Feature Component
```typescript
// File: /features/content-inbox/components/ContentInboxEditor.tsx
interface ContentInboxEditorProps {
  item: ContentInboxItem;
  onSave: (item: ContentInboxItem) => Promise<void>;
  onCancel: () => void;
}

export function ContentInboxEditor({ item, onSave, onCancel }: ContentInboxEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(item);
    setIsLoading(false);
  };
  
  const handleContentChange = (content: string) => {
    setHasChanges(true);
    // Update item content
  };
  
  const isFormValid = () => {
    return item.title.length > 0 && item.content.length > 0;
  };
  
  const getActionText = () => {
    return isLoading ? 'Saving...' : 'Save Changes';
  };
  
  return (
    <div className="content-inbox__editor">
      {/* Component implementation */}
    </div>
  );
}
```

This enhancement makes the naming system even more comprehensive and LLM-friendly!