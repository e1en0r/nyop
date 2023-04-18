import '@testing-library/jest-dom/extend-expect';
import { Home } from 'pages/Home/Home';
import { render } from '../utils';

describe('<Home />', () => {
  it('should render', () => {
    const { getByRole } = render(<Home />);

    expect(getByRole('main')).toBeTruthy();
  });
});
