import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"

const ForbiddenPage = () => {

  const navigate = useNavigate();

  const onClickHome = () => {
    navigate('/');
  }

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, Bạn không có quyền !!"
      extra={<Button type="primary" onClick={onClickHome}>Trang chủ</Button>}
    />
  )
}

export default ForbiddenPage;
