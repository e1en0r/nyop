import { MainContentAlert } from 'components/MainContentAlert';
import { PhorkIcon } from 'icons/PhorkIcon';
import { render } from '../utils';

describe('<MainContentAlert />', () => {
  it('should render a warning alert message', () => {
    const { container, getByText } = render(<MainContentAlert color="warning" icon={PhorkIcon} message="Alert!" />);

    expect(getByText('Alert!')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('should render a danger alert message', () => {
    const { container, getByText } = render(<MainContentAlert color="danger" icon={PhorkIcon} message="Alert!" />);

    expect(getByText('Alert!')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('should render a primary alert message', () => {
    const { container, getByText } = render(<MainContentAlert color="primary" icon={PhorkIcon} message="Alert!" />);

    expect(getByText('Alert!')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('should render a default alert message', () => {
    const { container, getByText } = render(<MainContentAlert icon={PhorkIcon} message="Alert!" />);

    expect(getByText('Alert!')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
