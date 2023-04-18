import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet';
import { Rhythm } from '@phork/phorkit';
import focusRing from '@phork/phorkit/styles/modules/common/FocusRing.module.css';
import { APP_NAME } from 'config/strings';
import { MissingContentAlert } from 'components/MissingContentAlert';
import { PagePaper } from 'components/PagePaper';

const StyledLink = styled.a`
  border-radius: 100%;
  display: block;
  position: relative;

  --focus-ring-color: var(--phork-accent-color);
  --focus-ring-size: 16px;

  &:active {
    --focus-ring-opacity: 0.4;
  }
`;

export const FourOhFour = (): React.ReactElement => {
  return (
    <PagePaper centered flexible>
      <Helmet>
        <title>{`${APP_NAME} - 404`}</title>
      </Helmet>

      <Rhythm grouped my={6}>
        <StyledLink className={cx(focusRing.focusRing, focusRing['focusRing--hoverable'])} href="/">
          <MissingContentAlert color="primary" message="Page not found" />
        </StyledLink>
      </Rhythm>
    </PagePaper>
  );
};
