/**
 * @fileoverview Test for Button component
 * @module Button.test
 * @llm-test-component
 * @test-coverage 80
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  // Default props
  const defaultProps = {
    children: 'Click me',
  };

  // Helper function to render component
  const renderComponent = (props = {}) => {
    return render(<Button {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const className = 'custom-class';
      renderComponent({ className });
      expect(screen.getByRole('button')).toHaveClass('btn', 'btn--primary', className);
    });

    it('should render children correctly', () => {
      const childText = 'Test child content';
      renderComponent({ children: childText });
      expect(screen.getByText(childText)).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('should apply variant classes correctly', () => {
      const { rerender } = renderComponent({ variant: 'secondary' });
      expect(screen.getByRole('button')).toHaveClass('btn--secondary');
      
      rerender(<Button variant="danger">Click me</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--danger');
    });

    it('should apply size classes correctly', () => {
      const { rerender } = renderComponent({ size: 'small' });
      expect(screen.getByRole('button')).toHaveClass('btn--small');
      
      rerender(<Button size="large">Click me</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn--large');
      
      // Medium size should not add extra class
      rerender(<Button size="medium">Click me</Button>);
      expect(screen.getByRole('button')).not.toHaveClass('btn--medium');
    });

    it('should handle loading state', () => {
      renderComponent({ loading: true });
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('is-loading');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });

    it('should render icons correctly', () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      const rightIcon = <span data-testid="right-icon">→</span>;
      
      renderComponent({ iconLeft: leftIcon, iconRight: rightIcon });
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByTestId('left-icon').parentElement).toHaveClass('btn__icon-left');
      expect(screen.getByTestId('right-icon').parentElement).toHaveClass('btn__icon-right');
    });

    it('should not render icons when loading', () => {
      const leftIcon = <span data-testid="left-icon">←</span>;
      const rightIcon = <span data-testid="right-icon">→</span>;
      
      renderComponent({ loading: true, iconLeft: leftIcon, iconRight: rightIcon });
      
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick });
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not fire click when disabled', async () => {
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick, disabled: true });
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not fire click when loading', async () => {
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick, loading: true });
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderComponent({ 'aria-label': 'Submit form' });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('should be keyboard navigable', async () => {
      renderComponent();
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(document.activeElement).toBe(button);
    });

    it('should announce loading state to screen readers', () => {
      renderComponent({ loading: true });
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined props gracefully', () => {
      renderComponent({ 
        variant: undefined,
        size: undefined,
        className: undefined 
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn--primary');
    });

    it('should forward refs correctly', () => {
      const ref = jest.fn();
      render(<Button ref={ref}>Click me</Button>);
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('should pass through HTML button attributes', () => {
      renderComponent({ 
        type: 'submit',
        form: 'test-form',
        name: 'submit-button' 
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('form', 'test-form');
      expect(button).toHaveAttribute('name', 'submit-button');
    });
  });
});