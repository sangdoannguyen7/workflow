import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"

const NotfoundPage = () => {

  const navigate = useNavigate();

  const onClickHome = () => {
    navigate('/');
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm không tồn tại !!"
      extra={<Button type="primary" onClick={onClickHome}>Trang chủ</Button>}
    />
  )
}

export default NotfoundPage
