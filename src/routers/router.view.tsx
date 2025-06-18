import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderLayout from "../layout/sider.layout";
import { Layout } from "antd";
import HeaderComponent from '../layout/header.layout';
import FooterComponent from "../layout/footer.layout";
import NotfoundPage from "../views/exception/notfound.view";
import UserPage from "../views/user/view.user.tsx";
import GroupPage from "../views/group/view.group.tsx";
import PermissionPage from "../views/permisison/view.permission.tsx";
import SitePage from "../views/site/view.site.tsx";
import CalendarPage from "../views/calendar/view.calendar.tsx";
import DashboardPage from "../views/dashboard/view.dashboard.tsx";

// const Dashboard = lazy(DashBoardPage);

const RenderRouter = () => {

  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  // const isLogged = true;

  return (
    // <BrowserRouter basename="/manager">
    <BrowserRouter>
      {/*{*/}
      {/*  // isLogged &&*/}
        <Layout>
          <SiderLayout/>
          <Layout style={{margin: '-8px -8px'}}>
            <HeaderComponent />
            <Layout.Content
              style={{
                margin: '8px 8px 0px 24px',
                // background: colorBgContainer,
                borderRadius: 8
              }}
            >
              <Routes>
                <Route path='/'>
                  <Route path='/dashboard' element={<DashboardPage />} />
                  <Route path='/account' element={<UserPage />} />
                  <Route path='/group' element={<GroupPage />} />
                  <Route path='/permission' element={<PermissionPage />} />
                  <Route path='/site' element={<SitePage />} />
                  <Route path='/hotel' element={<UserPage />} />
                  <Route path='/room' element={<UserPage />} />
                  <Route path='/order' element={<UserPage />} />
                  {/* <Route path='/schedule' element={<SchedulePage />}/> */}
                  <Route path='/calendar' element={<CalendarPage />}/>
                  <Route path='/price' element={<UserPage />} />
                  <Route path='/rating' element={<UserPage />} />
                  <Route path='/statistic' element={<UserPage />} />
                </Route>
                <Route path='*' element={<NotfoundPage />} />
              </Routes>
            </Layout.Content>
            <FooterComponent />
          </Layout>
        </Layout>
      {/*}*/}
      {/*{*/}
      {/*  !isLogged &&*/}
      {/*  <ForbiddenPage />*/}
      {/*}*/}
    </BrowserRouter>
  )
};

export default RenderRouter;