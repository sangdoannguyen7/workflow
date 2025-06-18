import { Layout, theme } from 'antd';

const FooterComponent = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Footer style={{ margin: '0 16px 0 40px', background: colorBgContainer, borderTopLeftRadius: 6, borderTopRightRadius: 6, textAlign: 'center'}}>
    {/* <Layout.Footer style={{ textAlign: 'center'}}> */}
      Trải nghiệm travel @ 2023 Phát triển bởi Nguyễn Thanh Sang
    </Layout.Footer>
  )
}

export default FooterComponent;
