import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { APP_NAME } from 'config/strings';
import { PagePaper } from 'components/PagePaper';
import { SourceProvider } from 'components/SourceProvider';
import { StateConsumer, StateProvider } from 'components/StateProvider';
import { Canvas } from './Canvas';
import { Form } from './Form';

export function Home(): JSX.Element {
  return (
    <Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>

      <Fragment>
        <PagePaper centered flexible role="main">
          <StateProvider>
            <StateConsumer>
              {({ state: { showCanvas } }) => <SourceProvider>{showCanvas ? <Canvas /> : <Form />}</SourceProvider>}
            </StateConsumer>
          </StateProvider>
        </PagePaper>
      </Fragment>
    </Fragment>
  );
}
