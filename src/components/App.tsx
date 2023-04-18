import { Helmet } from 'react-helmet';
import { AccessibilityProvider, Modals, Toasts, Theme, ThemeProvider } from '@phork/phorkit';
import { AppContent } from 'components/AppContent';

export type AppProps = {
  themeId: Theme;
};

export const App = ({ themeId }: AppProps): React.ReactElement => (
  <ThemeProvider themeId={themeId}>
    <AccessibilityProvider>
      <Toasts position="top-right">
        <Modals>
          <Helmet>
            <script async src="/static/scripts/matomo.js" type="text/javascript" />
          </Helmet>

          <AppContent />
        </Modals>
      </Toasts>
    </AccessibilityProvider>
  </ThemeProvider>
);

App.displayName = 'App';
