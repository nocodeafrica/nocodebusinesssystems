# Contributing to Horizon Systems

Thank you for your interest in contributing to Horizon Systems! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Mobile Development](#mobile-development)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. npm or yarn package manager
3. Git for version control
4. VS Code (recommended) with extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript

### Initial Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/horizon-systems.git
   cd horizon-systems
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a New Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in small, focused commits
2. Test your changes locally
3. Run linting: `npm run lint`
4. Build successfully: `npm run build`

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use type inference where possible

```typescript
// Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const UserCard: React.FC<UserProps> = ({ id, name, email }) => {
  // Component implementation
};

// Avoid
const UserCard = (props: any) => {
  // Component implementation
};
```

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use proper naming conventions

```typescript
// Component naming: PascalCase
const UserDashboard = () => { };

// Hook naming: camelCase with 'use' prefix
const useUserData = () => { };

// Utility naming: camelCase
const formatCurrency = (value: number) => { };
```

### File Organization

```
components/
├── feature-name/
│   ├── Desktop.tsx         # Desktop component
│   ├── Mobile.tsx          # Mobile component
│   ├── index.tsx          # Smart loader
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
```

### Import Order

1. React and framework imports
2. Third-party libraries
3. Internal components
4. Types and interfaces
5. Utilities and helpers
6. Styles

```typescript
// 1. React/framework
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 2. Third-party
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

// 3. Internal components
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';

// 4. Types
import type { LocationData } from './types';

// 5. Utilities
import { formatDistance } from '@/lib/utils';
```

## Component Guidelines

### Component Structure

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import type { ComponentProps } from './types';

/**
 * Brief description of what the component does
 *
 * @param {string} prop1 - Description of prop1
 * @param {number} prop2 - Description of prop2
 */
export const MyComponent: React.FC<ComponentProps> = ({
  prop1,
  prop2
}) => {
  // 1. State declarations
  const [state, setState] = useState<StateType>(initialState);

  // 2. Hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Derived values
  const computedValue = useMemo(() => {
    return expensiveComputation(state);
  }, [state]);

  // 5. Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use custom design tokens from `tailwind.config.js`
- Maintain consistent spacing and sizing

```tsx
// Mobile-first approach
<div className="
  p-4
  md:p-6
  lg:p-8
  bg-white
  rounded-mobile-card
  shadow-mobile-card
  touch-manipulation
">
  <h2 className="
    text-mobile-title
    md:text-2xl
    font-semibold
  ">
    Title
  </h2>
</div>
```

## Mobile Development

### When to Create Separate Mobile Component

Create separate mobile versions for:
- Complex map interfaces
- 3D model viewers
- Complex dashboards
- Heavy data visualizations

### Mobile Component Pattern

```typescript
// components/feature/Mobile.tsx
'use client';

import { useMobileFeature } from '@/hooks/useMobileFeature';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';

export const MobileFeature = () => {
  const { data, loading } = useMobileFeature();

  return (
    <div className="mobile-container touch-manipulation">
      <MobileBottomSheet>
        {/* Mobile-optimized content */}
      </MobileBottomSheet>
    </div>
  );
};
```

### Mobile Performance Targets

- Maximum 200KB gzipped JS bundle per component
- Touch targets minimum 44px
- Smooth 60fps animations
- First contentful paint < 2s

## Testing

### Manual Testing Checklist

- [ ] Desktop browser (Chrome, Firefox, Safari)
- [ ] Mobile devices (iOS Safari, Android Chrome)
- [ ] Responsive breakpoints (375px, 768px, 1024px, 1280px)
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Loading states
- [ ] Error states
- [ ] Edge cases

### Browser Compatibility

Test on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Pull Request Process

### Before Submitting

1. Ensure code follows style guidelines
2. Update documentation if needed
3. Test on multiple devices/browsers
4. Run `npm run lint` and fix issues
5. Run `npm run build` successfully
6. Write descriptive commit messages

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Desktop browsers tested
- [ ] Mobile devices tested
- [ ] No console errors
- [ ] Builds successfully

## Screenshots
Add screenshots for UI changes

## Related Issues
Fixes #(issue number)
```

### Review Process

1. Submit PR against `develop` branch
2. Automated checks must pass
3. Request review from maintainers
4. Address feedback and comments
5. Squash commits if requested
6. PR will be merged by maintainers

## Commit Message Guidelines

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(recruitment): add candidate filtering system

- Implement filter by skills
- Add date range selector
- Update UI for mobile

Closes #123

---

fix(maps): resolve marker clustering issue

Fixed bug where markers would overlap on zoom

---

docs(readme): update installation instructions
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Questions?

If you have questions:
1. Check existing documentation in `/planning` directory
2. Search existing issues
3. Ask in team discussions
4. Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Horizon Systems!
