import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from 'lucide-react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  test('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toHaveClass('bg-transparent');

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByText('Link')).toHaveClass('bg-transparent');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border-2');
  });

  test('handles different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('text-lg');
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('!text-transparent');
  });

  test('renders with icon', () => {
    render(<Button icon={Settings}>Settings</Button>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  test('handles icon position', () => {
    const { rerender } = render(
      <Button icon={Settings} iconPosition="right">
        Right Icon
      </Button>
    );
    const button = screen.getByText('Right Icon');
    const icon = document.querySelector('svg');
    expect(button.nextSibling).toContainElement(icon);

    rerender(
      <Button icon={Settings} iconPosition="left">
        Left Icon
      </Button>
    );
    expect(button.previousSibling).toContainElement(icon);
  });

  test('applies animation classes', () => {
    const { rerender } = render(<Button animation="ripple">Ripple</Button>);
    expect(screen.getByText('Ripple')).toHaveClass('active:animate-ripple');

    rerender(<Button animation="pulse">Pulse</Button>);
    expect(screen.getByText('Pulse')).toHaveClass('hover:animate-pulse');

    rerender(<Button animation="bounce">Bounce</Button>);
    expect(screen.getByText('Bounce')).toHaveClass('active:animate-bounce');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  test('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
    expect(screen.getByText('Disabled')).toHaveClass('disabled:opacity-50');
  });

  test('applies shape styles', () => {
    const { rerender } = render(<Button shape="square">Square</Button>);
    expect(screen.getByText('Square')).toHaveClass('aspect-square');

    rerender(<Button shape="circle">Circle</Button>);
    expect(screen.getByText('Circle')).toHaveClass('rounded-full');
  });
});