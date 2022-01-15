//React
import { useEffect, useState } from "react";

//Ant-Design
import { Button, Col, Drawer, Menu, Row, Rate, Tag } from "antd";

//Graphql&Apollo
import { QUERY_TODOS } from "../graphql";
import { useQuery } from "@apollo/client";

//Components
import Page from "../components/page";

//Local storages
const LOCALSTORAGE_USER = "userName";

const ActivityList = ({
  setSeeForm, //set bool as a switch of open/close form
  setFormMode, //set string as a switch of formtype
  currentAct, //A ID to store current "activities"
  setCurrentAct,
  setActLock, //...It is useless
  setTodoID, //set ID to store current "todo"
}) => {
  //User
  const user = localStorage.getItem(LOCALSTORAGE_USER);
  //Hooks
  const [ActList, setActList] = useState([]); //A list to store all "activities" in "user"
  const [allTodoList, setAllTodoList] = useState([]); //A list to store all "todos" in "user"
  const [menuController, setMenuController] = useState(""); //A string(ID) as a switch of "activities"
  const [allTodoController, setAllTodoController] = useState(""); //A string(ID) as a switch of "todos"

  //Get datas in "user"
  const { data, loading, subscribeTOMore } = useQuery(QUERY_TODOS, {
    variables: { name: user },
  });
  useEffect(() => {
    if (data) {
      setActList(data.user.activity);
      setAllTodoList(() => {
        let todos = [...data.user.todo];
        let activities = [...data.user.activity];
        activities.forEach((ele) => {
          todos = todos.concat(ele.todo);
        });
        todos.sort(function (a, b) {
          let aa = new Date(a.dueTime);
          let bb = new Date(b.dueTime);
          return aa - bb;
        });
        return todos;
      });
    }
  }, [data]);
  //Add/Del Activity
  const addDelActivity = () => {
    setFormMode("addAct");
    setSeeForm(true);
  };
  //If activity is clicked,switch activity
  const switchActivity = (e) => {
    if (e.key === "addmore") {
      setMenuController(""); //add/del buttom should not be selected(If selected,it is ugly...)
    } else {
      setMenuController(e.key);
      setCurrentAct(e.key);
    }
  };
  //If todo is clicked,modify todo
  const handleAllClick = (e) => {
    setTodoID(e.key);
    setAllTodoController(e.key);
    setSeeForm(true);
    setFormMode("addTodo");
    setActLock(true);
  };

  //Return JSX component
  return (
    <Row style={{ display: "flex" }} gutter={8}>
      <div
        id="scrollableDiv"
        style={{
          height: "95vh",
          overflow: "auto",
          width: "15%",
          // backgroundColor: "#15395b",
        }}
      >
        {/*Activity switch on the left hand side*/}
        <Col flex={1}>
          <Menu
            onClick={switchActivity}
            // style={{ width: 256 }}
            selectedKeys={menuController}
            mode="vertical"
            theme="dark"
            style={{ backgroundColor: "#8D8FA4", borderRadius: "10px" }} 
          >
            <Menu.Item key="addmore">
              <Button
                type="ghost"
                style={{ color: "white" }}
                onClick={addDelActivity}
              >
                ADD / DELETE
              </Button>
            </Menu.Item>
            <Menu.Item key={"All"}>ALL</Menu.Item>
            {ActList.length === 0 ? (
              <div></div>
            ) : (
              ActList.map(function (ele) {
                return <Menu.Item key={ele.id}>{ele.title}</Menu.Item>;
              })
            )}
          </Menu>
        </Col>
      </div>
      {/*Right hand side:Todo List based on activity switch*/}
      <Col flex={5}>
        {currentAct === "All" ? (
          <div
            id="scrollableDiv"
            style={{
              height: "95vh",
              overflow: "auto",
              padding: "0 16px",
            }}
          >
            <Menu
              onClick={handleAllClick}
              selectedKeys={allTodoController}
              theme="dark"
              style={{ backgroundColor: "#586D80", borderRadius: "10px" }} 
            >
              {allTodoList.length === 0 ? (
                <Menu.Item key="nothing">No todo Inside...</Menu.Item>
              ) : (
                allTodoList.map((ele) => {
                  return (
                    <Menu.Item key={ele.id}>
                      <Row>
                        <Col span={3}>{ele.title}</Col>
                        <Col span={10}>{ele.description}</Col>
                        <Col span={6}>{ele.dueTime}</Col>
                        <Col span={2}>
                          {ele.activity ? (
                            <Tag color="geekblue">{ele.activity}</Tag>
                          ) : (
                            <Tag color="lime">None</Tag>
                          )}
                        </Col>
                        <Col span={3}>
                          <Rate value={ele.priority} disabled />
                        </Col>
                      </Row>
                    </Menu.Item>
                  );
                })
              )}
            </Menu>
          </div>
        ) : (
          <Page
            setSeeForm={setSeeForm}
            setFormMode={setFormMode}
            currentAct={currentAct}
            ActList={ActList}
            setActLock={setActLock}
            setTodoID={setTodoID}
          />
        )}
      </Col>
    </Row>
  );
};

export default ActivityList;
