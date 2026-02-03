import React from 'react';
import { Layout } from 'antd';
import AppSider from './components/Sider';
import Headings from './components/Headings';
import AppChat from './components/Chat';

const { Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <AppSider />
      <Layout>
        <Headings>Voice Assistant by rvm</Headings>
        <AppChat />
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;