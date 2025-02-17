import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import Input from '../Input';

test('renders name', async () => {
  const { getByText } = render(
    <Input
      name="test"
      type="text"
      label="test"
      description="this is a test"
      error="there is an error"
    />,
  );
  await expect.element(getByText('this is a test')).toBeInTheDocument();
  await expect.element(getByText('there is an error')).toBeInTheDocument();
});
