import { Button, PageHeader, Dropdown, Menu } from "antd";
import {
  ScheduleOutlined,
  AppstoreOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import {
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const LOCALSTORAGE_USER = "userName";
const LOCALSTORAGE_PWD = "password";

const UserHeader = ({ SetCurrent, Current, setLogin }) => {
  const date = new Date();
  const currentDate = date.getMonth() + 1 + "/" + date.getDate();

  const handleClick = (e) => {
    console.log("clicked: ", e);
    SetCurrent(e.key);
  };
  const handleLogOut = () => {
    setLogin(false);
    localStorage.setItem(LOCALSTORAGE_USER, "");
    localStorage.setItem(LOCALSTORAGE_PWD, "");
    window.location.reload(false);
  };
  const username = localStorage.getItem(LOCALSTORAGE_USER);

  return (
    <PageHeader
      title="NOTee"
      subTitle={
        <Menu
          onClick={handleClick}
          selectedKeys={[Current]}
          mode="horizontal"
          theme="dark"
          style={{backgroundColor:"#8592A2"}}
        >
          <Menu.Item key="Todo" icon={<ScheduleOutlined />}>
            TODO
          </Menu.Item>
          <Menu.Item key="Activity" icon={<AppstoreOutlined />}>
            Activity
          </Menu.Item>
          <Menu.Item key="Add" icon={<PlusSquareOutlined />}>
            Add Todo
          </Menu.Item>
        </Menu>
      }
      extra={[
        <Button key="user" icon={<CalendarOutlined />}>
          {currentDate}
        </Button>,
        <Button key="user" icon={<UserOutlined />}>
          {username}
        </Button>,
        <Button key="LogOut" onClick={handleLogOut} icon={<LogoutOutlined />}>
          LogOut
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default UserHeader;
