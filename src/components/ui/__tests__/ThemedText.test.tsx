import { render, screen } from '@testing-library/react-native';

import { ThemedText } from '@/components/ui/ThemedText';

describe('ThemedText', () => {
  it('announces titles as headings', async () => {
    await render(<ThemedText variant="title">Events</ThemedText>);
    expect(screen.getByRole('heading', { name: 'Events' })).toBeOnTheScreen();
  });

  it('leaves font scaling on so text follows the system text size', async () => {
    await render(<ThemedText>Hello</ThemedText>);
    expect(screen.getByText('Hello')).not.toHaveProp('allowFontScaling', false);
  });

  it('renders secondary text', async () => {
    await render(<ThemedText variant="secondary">Starts at 9:00</ThemedText>);
    expect(screen.getByText('Starts at 9:00')).toBeOnTheScreen();
  });
});
