import { render, screen, fireEvent } from '@testing-library/react';
import ThemeCustomizer from '../pages/ThemeCustomizer';

describe('ThemeCustomizer', () => {
  it('muestra los temas y permite cambiar el tema actual', () => {
    render(<ThemeCustomizer />);
    expect(screen.getByText('Personalización de Tema')).toBeInTheDocument();
    expect(screen.getByText('Oscuro')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Claro'));
    expect(screen.getByText('Tema actual:')).toBeInTheDocument();
    expect(screen.getByText('Claro')).toBeInTheDocument();
  });
});