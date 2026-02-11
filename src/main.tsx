import { ConfigProvider } from 'antd';
import * as ReactDom from 'react-dom/client';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import App from './App';
import { componentsToken, globalToken } from './styled/antd-theme-overwrite';
import { Theme } from './styled/theme';
import { initDayJs } from './utils/date-time';

import './components/common/Editor/editor.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';

initDayJs();

ReactDom.createRoot(document.getElementById('root')!).render(
  <Theme>
    <ConfigProvider
      theme={{
        token: globalToken,
        components: componentsToken,
      }}
    >
      <App />
    </ConfigProvider>
  </Theme>
);
