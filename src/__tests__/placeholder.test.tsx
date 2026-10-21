import { render, screen } from '@testing-library/react-native';

import Index from '@/app/index';

it('renders the placeholder screen', async () => {
  await render(<Index />);
  expect(screen.getByText(/Edit src\/app\/index\.tsx/)).toBeOnTheScreen();
});
