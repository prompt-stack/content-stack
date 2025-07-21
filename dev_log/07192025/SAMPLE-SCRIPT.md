#!/bin/bash

# Naming Convention Audit Script
# Validates component names, function patterns, and file naming across the codebase

echo "Naming Convention Audit"
echo "======================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Counters
total_files=0
files_with_issues=0
total_violations=0

# Function to check component naming patterns
check_component_names() {
    echo -e "${BLUE}=== COMPONENT NAMING PATTERNS ===${NC}"
    
    # Check primitives (src/components/*.tsx)
    echo "Checking primitive components..."
    for file in src/components/*.tsx; do
        if [ -f "$file" ]; then
            ((total_files++))
            filename=$(basename "$file" .tsx)
            violations=0
            
            # Check for proper primitive naming (single word, no prefixes)
            if grep -E "export (const|function) (Base|UI|Core|Primitive)" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Contains technical prefixes (Base/UI/Core/Primitive)"
                ((violations++))
            fi
            
            # Check for component suffixes that shouldn't be there
            if grep -E "export (const|function) \w+(Component|Element|Widget)" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Contains unnecessary suffixes (Component/Element/Widget)"
                ((violations++))
            fi
            
            # Check for abbreviations
            if grep -E "export (const|function) (Btn|Inp|Nav|Img|Txt)" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Contains abbreviations (should be full words)"
                ((violations++))
            fi
            
            # Check file name matches component name
            if ! grep -E "export (const|function) $filename" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - File name doesn't match component name"
                ((violations++))
            fi
            
            if [ $violations -eq 0 ]; then
                echo -e "${GREEN}✓${NC} $file"
            else
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
    
    # Check feature components
    echo -e "\nChecking feature components..."
    for file in src/features/*/components/*.tsx; do
        if [ -f "$file" ]; then
            ((total_files++))
            feature_name=$(echo "$file" | sed 's/.*features\/\([^\/]*\)\/.*/\1/')
            filename=$(basename "$file" .tsx)
            violations=0
            
            # Convert kebab-case to PascalCase for pattern matching
            feature_pascal=$(echo "$feature_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^./\U&/')
            
            # Check if feature component follows [FeatureName][ComponentType] pattern
            if ! grep -E "export (const|function) ${feature_pascal}[A-Z]" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Should follow pattern: ${feature_pascal}[ComponentType]"
                ((violations++))
            fi
            
            if [ $violations -eq 0 ]; then
                echo -e "${GREEN}✓${NC} $file"
            else
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
    
    # Check page components  
    echo -e "\nChecking page components..."
    for file in src/pages/*.tsx; do
        if [ -f "$file" ]; then
            ((total_files++))
            filename=$(basename "$file" .tsx)
            violations=0
            
            # Check if page component ends with 'Page'
            if ! grep -E "export (const|function) \w+Page" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Page components must end with 'Page'"
                ((violations++))
            fi
            
            # Check file name matches component name
            if ! grep -E "export (const|function) $filename" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - File name doesn't match component name"
                ((violations++))
            fi
            
            if [ $violations -eq 0 ]; then
                echo -e "${GREEN}✓${NC} $file"
            else
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
}

# Function to check function naming patterns
check_function_patterns() {
    echo -e "\n${BLUE}=== FUNCTION NAMING PATTERNS ===${NC}"
    
    for file in src/components/*.tsx src/features/*/components/*.tsx src/pages/*.tsx; do
        if [ -f "$file" ]; then
            violations=0
            
            # Check for incorrect event handler patterns
            if grep -E "const (on[A-Z]|click[A-Z]|submit[A-Z])" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Use handle[Event] pattern for event handlers"
                ((violations++))
                # Show examples
                grep -E "const (on[A-Z]|click[A-Z]|submit[A-Z])" "$file" | head -2 | sed 's/^/    /'
            fi
            
            # Check for incorrect boolean function patterns
            if grep -E "const (check[A-Z]|validate[A-Z])" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - Consider is[Condition] or has[Property] for boolean functions"
                ((violations++))
            fi
            
            # Check for vague function names
            if grep -E "const (doSomething|handleStuff|processData|getData)" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Contains vague function names"
                ((violations++))
                grep -E "const (doSomething|handleStuff|processData|getData)" "$file" | sed 's/^/    /'
            fi
            
            if [ $violations -gt 0 ]; then
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
}

# Function to check props interface naming
check_props_interfaces() {
    echo -e "\n${BLUE}=== PROPS INTERFACE NAMING ===${NC}"
    
    for file in src/components/*.tsx src/features/*/components/*.tsx src/pages/*.tsx; do
        if [ -f "$file" ]; then
            violations=0
            
            # Check for incorrect interface prefixes
            if grep -E "interface I[A-Z]" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Don't use 'I' prefix for interfaces"
                ((violations++))
            fi
            
            # Check for non-standard props naming
            if grep -E "interface \w+(Properties|Configuration|Options)" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - Use [ComponentName]Props pattern"
                ((violations++))
            fi
            
            # Check that components have Props interface
            component_name=$(grep -E "export (const|function) [A-Z]" "$file" | head -1 | sed 's/.*export [^=]* \([A-Z][a-zA-Z]*\).*/\1/')
            if [ ! -z "$component_name" ] && ! grep -E "interface ${component_name}Props" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - Missing ${component_name}Props interface"
                ((violations++))
            fi
            
            if [ $violations -gt 0 ]; then
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
}

# Function to check hook naming patterns
check_hook_patterns() {
    echo -e "\n${BLUE}=== HOOK NAMING PATTERNS ===${NC}"
    
    for file in src/hooks/*.ts src/features/*/hooks/*.ts; do
        if [ -f "$file" ]; then
            ((total_files++))
            filename=$(basename "$file" .ts)
            violations=0
            
            # Check if hook starts with 'use'
            if ! echo "$filename" | grep -E "^use[A-Z]" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Hook files must start with 'use'"
                ((violations++))
            fi
            
            # Check if hook export matches filename
            if ! grep -E "export (const|function) $filename" "$file" > /dev/null; then
                echo -e "${YELLOW}⚠${NC}  $file - Hook export name doesn't match filename"
                ((violations++))
            fi
            
            # Check for incorrect hook naming patterns
            if grep -E "export (const|function) (hook[A-Z]|[a-z]+Hook)" "$file" > /dev/null; then
                echo -e "${RED}✗${NC} $file - Use use[Name] pattern, not [name]Hook"
                ((violations++))
            fi
            
            if [ $violations -eq 0 ]; then
                echo -e "${GREEN}✓${NC} $file"
            else
                ((files_with_issues++))
                ((total_violations+=$violations))
            fi
        fi
    done
}

# Function to check for anti-patterns
check_anti_patterns() {
    echo -e "\n${PURPLE}=== ANTI-PATTERN DETECTION ===${NC}"
    
    # Check for layer prefixes in component names
    echo "Checking for layer prefixes..."
    if grep -r "export.*\(Primitive\|Composed\|Feature\|Page\)[A-Z]" src/components/ src/features/ src/pages/ --include="*.tsx" > /dev/null; then
        echo -e "${RED}✗${NC} Found layer prefixes in component names:"
        grep -r "export.*\(Primitive\|Composed\|Feature\|Page\)[A-Z]" src/components/ src/features/ src/pages/ --include="*.tsx" | head -3
        ((total_violations++))
    fi
    
    # Check for technical prefixes
    echo -e "\nChecking for technical prefixes..."
    if grep -r "export.*\(UI\|Base\|Core\|Abstract\)[A-Z]" src/components/ src/features/ --include="*.tsx" > /dev/null; then
        echo -e "${RED}✗${NC} Found technical prefixes:"
        grep -r "export.*\(UI\|Base\|Core\|Abstract\)[A-Z]" src/components/ src/features/ --include="*.tsx" | head -3
        ((total_violations++))
    fi
    
    # Check for component suffixes
    echo -e "\nChecking for unnecessary suffixes..."
    if grep -r "export.*[A-Z][a-z]*\(Component\|Element\|Widget\)" src/components/ src/features/ --include="*.tsx" > /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Found unnecessary suffixes:"
        grep -r "export.*[A-Z][a-z]*\(Component\|Element\|Widget\)" src/components/ src/features/ --include="*.tsx" | head -3
        ((total_violations++))
    fi
    
    # Check for inconsistent prop naming
    echo -e "\nChecking for inconsistent prop patterns..."
    if grep -r "isLoading\|isDisabled\|isVisible" src/components/ src/features/ --include="*.tsx" > /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Found 'is' prefixes in props (prefer: loading, disabled, visible):"
        grep -r "isLoading\|isDisabled\|isVisible" src/components/ src/features/ --include="*.tsx" | head -3
    fi
}

# Function to check file structure alignment
check_file_structure() {
    echo -e "\n${BLUE}=== FILE STRUCTURE ALIGNMENT ===${NC}"
    
    # Check if component files are in correct locations
    echo "Checking component file locations..."
    
    # Pages should be in src/pages/
    for file in src/components/*Page.tsx; do
        if [ -f "$file" ]; then
            echo -e "${YELLOW}⚠${NC}  $(basename "$file") - Page components should be in src/pages/"
            ((total_violations++))
        fi
    done
    
    # Hooks should be in src/hooks/ or feature hooks/
    for file in src/components/use*.tsx; do
        if [ -f "$file" ]; then
            echo -e "${YELLOW}⚠${NC}  $(basename "$file") - Hooks should be in src/hooks/ or src/features/*/hooks/"
            ((total_violations++))
        fi
    done
    
    # Check for misplaced feature components
    for file in src/components/*Inbox*.tsx src/components/*Auth*.tsx src/components/*Dashboard*.tsx; do
        if [ -f "$file" ]; then
            echo -e "${YELLOW}⚠${NC}  $(basename "$file") - Feature components should be in src/features/"
            ((total_violations++))
        fi
    done
}

# Function to suggest fixes
suggest_fixes() {
    echo -e "\n${BLUE}=== SUGGESTED FIXES ===${NC}"
    
    if [ $total_violations -gt 0 ]; then
        echo "Common naming fixes:"
        echo "  1. Remove technical prefixes: BaseButton → Button"
        echo "  2. Use proper event handlers: onClick → handleClick"
        echo "  3. Use semantic prop names: isLoading → loading"
        echo "  4. Follow layer patterns: Panel → ContentInboxPanel"
        echo "  5. Move files to correct locations: components/HomePage.tsx → pages/HomePage.tsx"
        echo ""
        echo "For feature components:"
        echo "  - Pattern: [FeatureName][ComponentType]"
        echo "  - Example: ContentInboxPanel, AuthLoginForm"
        echo ""
        echo "For function names:"
        echo "  - Event handlers: handle[Event]"
        echo "  - Boolean checks: is[Condition] or has[Property]"
        echo "  - Actions: [verb][Subject]"
    fi
}

# Run all checks
check_component_names
check_function_patterns  
check_props_interfaces
check_hook_patterns
check_anti_patterns
check_file_structure
suggest_fixes

# Summary
echo -e "\n${BLUE}=== SUMMARY ===${NC}"
echo "Total files audited: $total_files"
echo "Files with issues: $files_with_issues" 
echo "Total violations: $total_violations"

if [ $total_violations -eq 0 ]; then
    echo -e "\n${GREEN}✨ All naming conventions followed correctly!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Found $total_violations naming violations${NC}"
    echo -e "Run with specific fixes to resolve issues."
    exit 1
fi