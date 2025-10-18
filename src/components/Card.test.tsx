/**
 * @fileoverview Test for Card component
 * @module Card.test
 * @test-coverage 90
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  const defaultProps = {
    children: 'Card content',
  };

  const renderComponent = (props = {}) => {
    return render(<Card {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with default variant', () => {
      renderComponent();
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card', 'card--default');
    });

    it('should render children correctly', () => {
      renderComponent({
        children: (
          <>
            <h2>Title</h2>
            <p>Description</p>
          </>
        ),
      });
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply elevated variant', () => {
      renderComponent({ variant: 'elevated' });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--elevated');
    });

    it('should apply outlined variant', () => {
      renderComponent({ variant: 'outlined' });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--outlined');
    });

    it('should apply glass variant', () => {
      renderComponent({ variant: 'glass' });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--glass');
    });
  });

  describe('interactive state', () => {
    it('should apply interactive class when interactive', () => {
      renderComponent({ interactive: true });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--interactive');
    });

    it('should not apply interactive class by default', () => {
      renderComponent();
      const card = screen.getByText('Card content').parentElement;
      expect(card).not.toHaveClass('card--interactive');
    });

    it('should handle click events when interactive', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      renderComponent({ interactive: true, onClick });
      const card = screen.getByText('Card content').parentElement;
      
      await user.click(card!);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('selected state', () => {
    it('should apply selected class when selected', () => {
      renderComponent({ selected: true });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--selected');
    });

    it('should add data-selected attribute when selected', () => {
      renderComponent({ selected: true });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveAttribute('data-selected', 'true');
    });

    it('should not have selected class by default', () => {
      renderComponent();
      const card = screen.getByText('Card content').parentElement;
      expect(card).not.toHaveClass('card--selected');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      renderComponent({ className: 'custom-card' });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card', 'custom-card');
    });

    it('should combine multiple classes', () => {
      renderComponent({ 
        className: 'custom-1 custom-2',
        variant: 'elevated',
        selected: true 
      });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card', 'card--elevated', 'card--selected', 'custom-1', 'custom-2');
    });
  });

  describe('Box props inheritance', () => {
    it('should apply default padding', () => {
      const { container } = renderComponent();
      // Card should have default padding='4' from the component
      expect(container.firstChild).toHaveClass('p-4');
    });

    it('should override default padding', () => {
      const { container } = renderComponent({ padding: '8' });
      expect(container.firstChild).toHaveClass('p-8');
    });

    it('should apply default rounded corners', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass('rounded-md');
    });

    it('should apply shadow for elevated variant', () => {
      const { container } = renderComponent({ variant: 'elevated' });
      expect(container.firstChild).toHaveClass('shadow-md');
    });

    it('should pass through other Box props', () => {
      const { container } = renderComponent({ 
        display: 'flex',
        direction: 'column',
        gap: '2'
      });
      expect(container.firstChild).toHaveClass('d-flex', 'flex-column', 'gap-2');
    });
  });

  describe('forwardRef', () => {
    it('should forward ref to Box component', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      // @ts-expect-error - testing edge case
      renderComponent({ children: null });
      const card = document.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should handle multiple boolean props', () => {
      renderComponent({ 
        selected: true, 
        interactive: true,
        variant: 'glass' 
      });
      const card = screen.getByText('Card content').parentElement;
      expect(card).toHaveClass('card--selected', 'card--interactive', 'card--glass');
    });
  });
});