import { Row, Col, Menu, Tag, Rate } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_TODOS } from "../graphql";

const LOCALSTORAGE_USER = "userName";

const TodoList = ({ setSeeForm, setFormMode, setActLock, setTodoID }) => {
  const handleClick = (e) => {
    console.log("TodoList: ");
    console.log(e.key);
    if (
      e.key === "PRIORITY" ||
      e.key === "FIRST" ||
      e.key === "SECOND" ||
      e.key === "THIRD" ||
      e.key === "FORTH" ||
      e.key === "FIFTH"
    ) {
      setSleKey("");
    } else {
      setSleKey(e.key);
      setTodoID(e.key);
      setFormMode("addTodo");
      setSeeForm(true);
      setActLock(true);
    }
  };
  const username = localStorage.getItem(LOCALSTORAGE_USER);
  const [sleKey, setSleKey] = useState([""]);
  const { data } = useQuery(QUERY_TODOS, { variables: { name: username } });
  const date = new Date();
  const currentDate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const compareDate = new Date(currentDate);
  // const [cols, setCols] = useState([]);
  // const [top5, setTop] = useState([]);
  const [todos, setTodo] = useState({
    first: [],
    second: [],
    third: [],
    forth: [],
    fifth: [],
    priority: [],
  });

  useEffect(() => {
    if (data) {
      let temp = data.user.todo;
      data.user.activity.map((a) => {
        temp = temp.concat(a.todo);
      });
      let todoObject = {
        first: [],
        second: [],
        third: [],
        forth: [],
        fifth: [],
        priority: [],
      };
      temp.map((e) => {
        let due = e.dueTime;
        let month =
          date.getMonth() + 1 >= 10
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1);
        let compare = date.getFullYear() + "-" + month + "-";

        switch (due) {
          case compare + date.getDate():
            todoObject.first.push(e);
            break;
          case compare + (date.getDate() + 1):
            todoObject.second.push(e);
            break;
          case compare + (date.getDate() + 2):
            todoObject.third.push(e);
            break;
          case compare + (date.getDate() + 3):
            todoObject.forth.push(e);
            break;
          case compare + (date.getDate() + 4):
            todoObject.fifth.push(e);
            break;
          default:
            break;
        }
        if (e.priority === 5) {
          todoObject.priority.push(e);
        }
      });
      setTodo(todoObject);
    }
  }, [data]);
  function userMenu(userList, time, kkey) {
    return (
      <Menu
        onClick={handleClick}
        selectedKeys={sleKey}
        theme="dark"
        mode="inline"
        style={{
          borderRadius: "10px",
          backgroundColor: "#586D80",
        }}
      >
        <Menu.Item
          key={kkey}
          style={{
            top: "-4.5px",
            borderRadius: "10px",
            backgroundColor: "#8D8FA4",
          }}
        >
          <Row>
            <Col span={10}></Col>
            <Col span={4}>
              <Tag color="cyan">{time}</Tag>
            </Col>
            <Col span={10}></Col>
          </Row>
        </Menu.Item>
        {userList.length === 0
          ? console.log("HAHA")
          : userList.map((eele) => {
              return (
                <Menu.Item
                  key={eele.id}
                >
                  {
                    <Row>
                      <Col span={3}>{eele.title}</Col>
                      <Col span={10}>{eele.description}</Col>
                      <Col span={7}>{eele.dueTime}</Col>
                      <Col span={2}>
                        {eele.activity ? (
                          <Tag color="geekblue">{eele.activity}</Tag>
                        ) : (
                          <Tag color="lime">None</Tag>
                        )}
                      </Col>
                      <Col span={2}>
                        <Rate value={eele.priority} disabled />
                      </Col>
                    </Row>
                  }
                </Menu.Item>
              );
            })}
      </Menu>
    );
  }
  return (
    <div
      id="scrollableDiv"
      style={{
        height: "95vh",
        overflow: "auto",
        padding: "0 16px",
      }}
    >
      {userMenu(todos.priority, "PRIORITY", "PRIORITY")}
      {userMenu(
        todos.first,
        date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          (date.getDate() + 0),
        "FIRST"
      )}
      {userMenu(
        todos.second,
        date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          (date.getDate() + 1),
        "SECOND"
      )}
      {userMenu(
        todos.third,
        date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          (date.getDate() + 2),
        "THIRD"
      )}
      {userMenu(
        todos.forth,
        date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          (date.getDate() + 3),
        "FORTH"
      )}
      {userMenu(
        todos.fifth,
        date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          (date.getDate() + 4),
        "FIFTH"
      )}
    </div>
  );
};

export default TodoList;
