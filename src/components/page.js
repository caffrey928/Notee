import { ScheduleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Menu, Rate, Row, Col, Tag } from "antd";
import { useEffect, useState } from "react";
import { QUERY_ACTIVITY } from "../graphql";
import {
  SyncOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const LOCALSTORAGE_USER = "userName";
const Page = ({
  setSeeForm,
  setFormMode,
  currentAct,
  setActLock,
  setTodoID,
}) => {
  const [protodo, setProTodo] = useState([]); //merge progress and todo by time
  const [actName, setActName] = useState();
  const [todoController, setTodoController] = useState("");
  const date = new Date();
  const month =
    date.getMonth() + 1 >= 10
      ? date.getMonth() + 1
      : "0" + (date.getMonth() + 1);
  const currentDate = date.getFullYear() + "-" + month + "-" + date.getDate();
  const compareDate = new Date(currentDate);

  const { data, loading, subscribeToMore } = useQuery(QUERY_ACTIVITY, {
    variables: {
      id: currentAct,
    },
  });
  useEffect(() => {
    if (data) {
      setActName(data.activity.title);
      setProTodo(() => {
        let protodoList = [];
        let proList = [...data.activity.progress];
        let todoList = [...data.activity.todo];
        proList.sort(function (a, b) {
          let aa = new Date(a.dueTime);
          let bb = new Date(b.dueTime);
          return aa - bb;
        });
        todoList.sort(function (a, b) {
          let aa = new Date(a.dueTime);
          let bb = new Date(b.dueTime);
          return aa - bb;
        });
        for (let i = 0; i < proList.length; i++) {
          let due = new Date(proList[i].dueTime);
          let todoInPro = todoList.filter(
            (eele) => new Date(eele.dueTime) <= due
          );
          todoList = todoList.filter((eele) => new Date(eele.dueTime) > due);
          protodoList.push({ progress: proList[i], todo: todoInPro });
        }
        protodoList.push({ progress: null, todo: [...todoList] });
        return protodoList;
      });
    }
  }, [data]);
  function handleAddProgress() {
    setFormMode("addProgress");
    setSeeForm(true);
  }
  const handleDelProgress = (e) => {
    setFormMode("delProgress");
    setSeeForm(true);
  };
  const handleClick = (e) => {
    console.log(e.key);
    setTodoID(e.key);
    setFormMode("addTodo");
    setSeeForm(true);
    setActLock(true);
  };
  return (
    <div
      id="scrollableDiv"
      style={{
        height: "95vh",
        overflow: "auto",
        padding: "0 16px",
      }}
    >
      <Menu theme="dark" style={{ backgroundColor: "#8D8FA4", borderRadius: "10px" }}>
        <Menu.Item>
          <Row>
            <Col span={3}>{actName}</Col>
            <Col span={15}></Col>
            <Col span={3}>
              <Button
                type="ghost"
                onClick={handleAddProgress}
                style={{ color: "white" }}
              >
                AddProgress
              </Button>
            </Col>
            <Col span={3}>
              <Button
                type="ghost"
                onClick={handleDelProgress}
                style={{ color: "white" }}
              >
                DelProgress
              </Button>
            </Col>
          </Row>
        </Menu.Item>
      </Menu>
      <Menu
        onClick={handleClick}
        selectedKeys={todoController}
        mode="inline"
        theme="dark"
        style={{ backgroundColor: "#586D80", borderRadius: "10px" }}
      >
        {protodo.map((ele) => {
          if (ele.progress === null) {
            return (
              <SubMenu
                key="__out of progress"
                title={
                  <Row>
                    <Col span={20}>Out of Progress</Col>
                    <Col span={2}></Col>
                    <Col span={2}>
                      <Tag icon={<ClockCircleOutlined />} color="default">
                        {ele.todo.length} left
                      </Tag>
                    </Col>
                  </Row>
                }
              >
                {ele.todo.length === 0 ? (
                  <div></div>
                ) : (
                  ele.todo.map((eele) => {
                    return (
                      <Menu.Item key={eele.id}>
                        {
                          <Row >
                            <Col span={3}>{eele.title}</Col>
                            <Col span={10}>{eele.description}</Col>
                            <Col span={4}>{eele.dueTime}</Col>
                            <Col span={4}>{eele.activity}</Col>
                            <Col span={3}>
                              <Rate value={eele.priority} disabled />
                            </Col>
                          </Row>
                        }
                      </Menu.Item>
                    );
                  })
                )}
              </SubMenu>
            );
          } else {
            return (
              <SubMenu
                key={ele.progress.id}
                title={
                  <Row>
                    <Col span={20}>
                      <div>{ele.progress.title}</div>
                    </Col>
                    <Col span={2}>
                      {new Date(ele.progress.dueTime) >= compareDate ? (
                        new Date(ele.progress.dueTime) > compareDate ? (
                          <Tag icon={<ScheduleOutlined />} color="processing">
                            Future
                          </Tag>
                        ) : (
                          <Tag icon={<SyncOutlined spin />} color="green">
                            Today
                          </Tag>
                        )
                      ) : (
                        <Tag icon={<HistoryOutlined />} color="magenta">
                          Past
                        </Tag>
                      )}
                    </Col>
                    <Col span={2}>
                      <Tag icon={<ClockCircleOutlined />} color="default">
                        {ele.todo.length} left
                      </Tag>
                    </Col>
                  </Row>
                }
              >
                {ele.todo.length === 0 ? (
                  <div></div>
                ) : (
                  ele.todo.map((eele) => {
                    return (
                      <Menu.Item key={eele.id}>
                        {
                          <Row>
                            <Col span={3}>{eele.title}</Col>
                            <Col span={10}>{eele.description}</Col>
                            <Col span={4}>{eele.dueTime}</Col>
                            <Col span={4}>{eele.activity}</Col>
                            <Col span={3}>
                              <Rate value={eele.priority} disabled />
                            </Col>
                          </Row>
                        }
                      </Menu.Item>
                    );
                  })
                )}
              </SubMenu>
            );
          }
        })}
      </Menu>
    </div>
  ); //(
  //   <List
  //     header={
  //       <Row>
  //         <Col flex={10}>{actName}</Col>
  //         <Col flex={1}>
  //           <Button type="dashed" onClick={handleAddProgress}>
  //             addProgress
  //           </Button>
  //         </Col>
  //         <Col flex={1}>
  //           <Button type="dashed" onClick={handleTodoClick}>
  //             addTodo
  //           </Button>
  //         </Col>
  //       </Row>
  //     }
  //     bordered
  //     itemLayout="vertical"
  //   >
  //     <List.Item>{'Your have no progress in "' + actName + '"'}</List.Item>
  //   </List>
  // ) : (
  //   <List
  //     header={<div>{actName}</div>}
  //     bordered
  //     dataSource={protodo}
  //     itemLayout="vertical"
  //     renderItem={(item) =>
  //       item.todo.length === 0 ? (
  //         <List.Item>
  //           <List header={<div>{item.progress.title}</div>} bordered>
  //             <List.Item>You have no todos in this progress</List.Item>
  //           </List>
  //         </List.Item>
  //       ) : (
  //         <List.Item>
  //           <List
  //             header={<div>{item.progress.title}</div>}
  //             bordered
  //             dataSource={item.todo}
  //             renderItem={(ittem) => (
  //               <div>
  //                 <List.Item
  //                   key={ittem.id}
  //                   extra={<Rate defaultValue={ittem.priority} disabled />}
  //                 >
  //                   {ittem.title}
  //                 </List.Item>
  //                 <List.Item key={ittem.id + "1"}>
  //                   {ittem.description}
  //                 </List.Item>
  //               </div>
  //             )}
  //           ></List>
  //         </List.Item>
  //       )
  //     }
  //   >
  //     <Button type="dashed" onClick={handleAddProgress}>
  //       addProgress
  //     </Button>
  //     <Button type="dashed" onClick={handleTodoClick}>
  //       addTodo
  //     </Button>
  //   </List>
};

export default Page;
