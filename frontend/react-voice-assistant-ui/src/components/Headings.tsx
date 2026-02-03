import { type ReactNode } from 'react';
import { Layout, theme } from 'antd';

interface Props {
  children: ReactNode;
}

const { Header } = Layout;

const Headings = ({ children }: Props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h3 style={{ margin: 0 }}>{children}</h3>
    </Header>
  );
};

export default Headings;