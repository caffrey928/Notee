import { useMutation, useQuery } from "@apollo/client";
import { Select, Form, Button, DatePicker, Rate, Input, message } from "antd";
import moment from 'moment';
import {
  QUERY_TODOS,
  QUERY_ACTIVITY,
  CREATE_ACTIVITY,
  CREATE_PROGRESS,
  CREATE_TODO,
  DELETE_ACTIVITY,
  DELETE_TODO,
  DELETE_PROGRESS,
  MODIFY_TODO,
} from "../graphql";
import useAct from "../hook/useAct";
import { useState, useEffect } from "react";
import FormItem from "antd/lib/form/FormItem";

const { Option } = Select;
const LOCALSTORAGE_USER = "userName";

const DrawerForm = ({ formMode, setSeeForm, currentAct, actLock, todoID,seeForm }) => {
  const userName = localStorage.getItem(LOCALSTORAGE_USER);
  const [actForm] = Form.useForm();
  const [addProForm] = Form.useForm();
  const [delProForm] = Form.useForm();
  const [todoForm] = Form.useForm();
  const [actMutation] = useMutation(CREATE_ACTIVITY);
  const [proMutation] = useMutation(CREATE_PROGRESS);
  const [todoMutation] = useMutation(CREATE_TODO);
  const [ActList, setActList] = useState([]);
  const [currentActList, setCurrentActList] = useState();
  const [deleteAct] = useMutation(DELETE_ACTIVITY);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [modifyTodo] = useMutation(MODIFY_TODO);
  const [proDeletion] = useMutation(DELETE_PROGRESS);

  const { data } = useQuery(QUERY_TODOS, {
    variables: { name: userName },
  });
  useEffect(() => {
    if (data) {
      setActList(data.user.activity);
      setCurrentActList(() => {
        var act;
        data.user.activity.map((ele) => {
          if (ele.id === currentAct) {
            act = ele;
            console.log(act);
          }
        });
        return act;
      });
    }
  }, [data]);
  useEffect(() => {
    if (currentAct) {
      setCurrentActList(() => {
        var act;
        data.user.activity.map((ele) => {
          if (ele.id === currentAct) {
            act = ele;
            console.log(act);
          }
        });
        return act;
      });
    }
  }, [currentAct]);
  useEffect(()=>{
    if(seeForm){
      todoForm.resetFields();
    }
  },[seeForm])
  const handleActFinish = async () => {
    let values = actForm.getFieldValue();
    let canAdd = true;
    data.user.activity.map((a) => {
      if (a.title === values.actTitle) canAdd = false;
    });
    if (!canAdd) {
      message.error("Activity Exist");
      actForm.resetFields();
      return;
    }
    try {
      await actMutation({
        variables: {
          users: [userName],
          title: values.actTitle,
        },
        refetchQueries: () => [
          {
            query: QUERY_TODOS,
            variables: {
              name: userName,
            },
          },
        ],
      });
      actForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleActDelete = async () => {
    let values = actForm.getFieldValue();
    let aId = "";
    data.user.activity.map((a) => {
      if (a.title === values.actTitle) {
        aId = a.id;
      }
    });
    if (!aId) {
      message.error("Activity does not exist");
      return;
    }
    try {
      await deleteAct({
        variables: {
          id: aId,
        },
        refetchQueries: () => [
          {
            query: QUERY_TODOS,
            variables: {
              name: userName,
            },
          },
        ],
      });
      actForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleProCreateFinish = async (values) => {
    let tempA = {};
    data.user.activity.map((a) => {
      if (a.id === currentAct) tempA = a;
    });
    let canCreate = true;
    tempA.progress.map((p) => {
      if (p.dueTime === values.proDue.format("YYYY-MM-DD")) {
        message.error("dueTime cannot be same as another progress");
        canCreate = false;
      }
    });
    if (!canCreate) {
      addProForm.resetFields();
      return;
    }
    try {
      await proMutation({
        variables: {
          title: values.proTitle,
          dueTime: values.proDue.format("YYYY-MM-DD"),
          activity: currentAct,
        },
        refetchQueries: () => [
          {
            query: QUERY_ACTIVITY,
            variables: {
              id: currentAct,
            },
          },
        ],
      });
      addProForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };
  const handleProDel = async (values) => {
    try {
      await proDeletion({
        variables:{
          id:values.progress,
          activity: values.actID,
        },
        refetchQueries: () => [
          {
            query: QUERY_TODOS,
            variables: {
              name:userName,
            },
          },
        ]
      })
      delProForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };
  const handleTodoModify = async () => {
    let values = todoForm.getFieldValue();
    console.log(values)
    try {
      let aId = "";
      data.user.activity.map((a) => {
        if (a.title === values.todoActivity) {
          aId = a.id;
        }
      });
      await modifyTodo({
        variables: {
          id: todoID,
          name: userName,
          title: values.todoTitle,
          dueTime: values.todoDue.format("YYYY-MM-DD"),
          activity: values.todoActivity,
          description: values.todoDescription,
          priority: values.todoPriority,
        },
        refetchQueries: () => [
          {
            query: QUERY_TODOS,
            variables: {
              name: userName,
            },
          },
          aId?{
            query: QUERY_ACTIVITY,
            variables: {
              id: aId,
            },
          }:{},
        ],
      });
      todoForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleTodoDelete = async () => {
    
    let values = todoForm.getFieldValue();
    console.log(values)
    try {
      let aId = "";
      data.user.activity.map((a) => {
        if (a.title === values.todoActivity) {
          aId = a.id;
        }
      });
      await deleteTodo({
        variables: {
          id: todoID,
          name: userName,
          activity: values.todoActivity,
        },
        refetchQueries: () => [
          {
            query: QUERY_TODOS,
            variables: {
              name: userName,
            },
          },
          aId?{
            query: QUERY_ACTIVITY,
            variables: {
              id: aId,
            },
          }:{},
        ],
      });
      todoForm.resetFields();
      setSeeForm(false);
    } catch (e) {
      message.error(e.message);
    }
  };

  const addAct = () => {
    return (
      <Form form={actForm}>
        <Form.Item
          label="Activity"
          name="actTitle"
          rules={[{ required: true, messa: "Activities cannot be empty" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleActFinish}>
            Add
          </Button>
          <Button
            type="danger"
            htmlType="submit"
            onClick={handleActDelete}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const modTodo = () => {
    var todoObj;
    var act="";
    if(data.user){
      data.user.todo.map((ele)=>{
        if(ele.id===todoID){
          todoObj = ele;
          act = todoObj.activity;
        }
      })
    }
    if(data.user.activity){
      data.user.activity.map((ele)=>{
        if(ele.todo.length>0){
          ele.todo.map((eele)=>{
            if(eele.id===todoID){
              todoObj=eele;
              act = todoObj.activity;
            }
          })
        }
      })
    }
    console.log(todoObj)
    return (
      todoObj?
      <Form form={todoForm}>
        <Form.Item label="Activity" name="todoActivity" initialValue={act}>
          <div>
            {actLock === true ? (
              act
            ) : (
              <Select placeholder="Select Activity">
                <Option value="">None</Option>
                {ActList.map(function (ele) {
                  return <Option value={ele.id}>{ele.title}</Option>;
                })}
              </Select>
            )}
          </div>
        </Form.Item>
        <Form.Item
          label="Title"
          name="todoTitle"
          initialValue={todoObj.title}
          rules={[{ required: true, message: "Title cannot be empty"}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="todoDescription"
          initialValue={todoObj.description}
          rules={[{ required: true, message: "Description cannot be empty" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Due"
          name="todoDue"
          initialValue={moment(todoObj.dueTime,"YYYY-MM-DD")}
          rules={[{ required: true, message: "DueDay cannot be empty" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="todoPriority"
          initialValue={todoObj.priority}
          rules={[{ required: true, message: "Priority cannot be empty" }]}
        >
          <Rate allowClear={false}  />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleTodoModify}>
            Modify
          </Button>
          <Button
            type="danger"
            htmlType="submit"
            style={{ marginLeft: "10px" }}
            onClick={handleTodoDelete}
          >
            Delete
          </Button>
        </Form.Item>
      </Form>
      :<div>"loading..."</div>
    );
  };
  const addProgress = () => {
    var a = "";
    ActList.map((ele) => {
      if (ele.id === currentAct) {
        a = ele.title;
      }
    });
    return (
      <Form form={addProForm} onFinish={handleProCreateFinish}>
        <Form.Item label="Activity" name="Activity">
          <div>{a}</div>
        </Form.Item>
        <Form.Item
          label="Title"
          name="proTitle"
          rules={[{ required: true, message: "Title cannot be empty" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Due"
          name="proDue"
          rules={[{ required: true, message: "DueDay cannot be empty" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const deleteProgress = () => {
    return currentActList ? (
      <Form form={delProForm} onFinish={handleProDel}>
        <Form.Item label="Activity" name="Activity">
          <div>{currentActList.title}</div>
        </Form.Item>
        <Form.Item label="actID" name="actID" initialValue={currentActList.id} hidden>
          <Input name="actID"/>
        </Form.Item>
        {currentActList.progress.length === 0 ? (
          <Form.Item
            label={"There is no progress in " + currentActList.title}
            name="nothing"
          ></Form.Item>
        ) : (
          <Form.Item
            label="Progress"
            name="progress"
            rules={[{ required: true, message: "Select a progress" }]}
          >
            <Select placeholder="Select Progress">
              {currentActList.progress.map((ele) => {
                return <Option value={ele.id}>{ele.title}</Option>;
              })}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={currentActList.progress.length === 0 ? true : false}
          >
            DEL
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <div>loading...</div>
    );
  };
  const switchMode = () => {
    switch (formMode) {
      case "addAct":
        return <div>{addAct()}</div>;
      case "addTodo":
        return <div>{modTodo()}</div>;
      case "addProgress":
        return <div>{addProgress()}</div>;
      case "delProgress":
        return <div>{deleteProgress()}</div>;
      default:
        return <div>{addAct()}</div>;
    }
  };
  return <div>{switchMode()}</div>;
};

export default DrawerForm;
