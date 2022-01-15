import "./App.css";
import UserContent from "./containers/UserContent";
import UserHeader from "./containers/UserHeader";
import { useState } from "react";
import { Drawer } from "antd";
import DrawerForm from "./containers/DrawerForm";
import Login from "./containers/login";
import { useQuery } from "@apollo/client";
import { QUERY_LOGIN } from "./graphql";

const LOCALSTORAGE_USER = "userName";
const LOCALSTORAGE_PWD = "password";

function App() {
  const userName = localStorage.getItem(LOCALSTORAGE_USER);
  const pwd = localStorage.getItem(LOCALSTORAGE_PWD);
  const [Current, SetCurrent] = useState("Todo");
  const [seeForm, setSeeForm] = useState(false);
  const [formMode, setFormMode] = useState("addAct");
  const [isLogin, setLogin] = useState(false);
  const [actLock, setActLock] = useState(false);
  const [todoID,setTodoID] = useState("");
  const { refetch } = useQuery(QUERY_LOGIN, {
    variables: {
      userName: userName,
      password: pwd,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const login = async () => {
    if (!(userName && pwd)) return false;
    const { data } = await refetch({
      userName: userName,
      password: pwd,
    });
    if (data.login) {
      setLogin(true);
      return true;
    }
    return false;
  };
  const [currentAct, setCurrentAct] = useState("All");

  const onClose = () => {
    setSeeForm(false);
  };
  login();

  return !isLogin ? (
    <Login setLogin={setLogin} />
  ) : (
    <div className="App">
      <UserHeader
        SetCurrent={SetCurrent}
        Current={Current}
        setLogin={setLogin}
      />
      <UserContent
        Current={Current}
        setSeeForm={setSeeForm}
        setFormMode={setFormMode}
        currentAct={currentAct}
        setCurrentAct={setCurrentAct}
        actLock={actLock}
        setActLock={setActLock}
        setTodoID = {setTodoID}
        seeForm={seeForm}
      />
      <Drawer
        title={formMode}
        placement="right"
        onClose={onClose}
        visible={seeForm}
      >
        <DrawerForm
          formMode={formMode}
          seeForm={seeForm}
          setSeeForm={setSeeForm}
          currentAct={currentAct}
          actLock={actLock}
          todoID = {todoID}
        />
      </Drawer>
    </div>
  );
}

export default App;
