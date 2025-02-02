import { ErpContextProvider } from '@/context/erp';
import { selectLangDirection } from '@/redux/translate/selectors';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  const langDirection = useSelector(selectLangDirection);

  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding"
        style={{
          margin: '30px -70px',
          width: '110%',
          maxWidth: '110%',
          minHeight: '600px',
          direction: langDirection,
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
