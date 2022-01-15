//React
import { useEffect, useState } from "react";

//Ant-Design
import { Form, Select, Button, DatePicker, Input, Rate, message } from "antd";

//Graphql&apollo
import { CREATE_TODO, QUERY_TODOS } from "../graphql";
import { useQuery, useMutation } from "@apollo/client";

//LocalStorage
const LOCALSTORAGE_USER = "userName";
//antd object
const { Option } = Select;
const AddList = () => {
  const userName = localStorage.getItem(LOCALSTORAGE_USER);
  const [form] = Form.useForm(); //Form field obj(get value&resetField)
  const [ActivityList, setActivity] = useState([]); //A list to store all "activities" in "user"
  const [addTodo] = useMutation(CREATE_TODO);
  //data in "user"
  const { data } = useQuery(QUERY_TODOS, {
    variables: { name: userName },
  });
  //Create todo
  const onFinish = async (values) => {
    try {
      await addTodo({
        variables: {
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
        ],
      });
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    }
  };
  useEffect(() => {
    if (data) {
      if (ActivityList.length) return;
      setActivity(data.user.activity);
    }
  }, [data]);
  /*Returns JSX Component
  This page is for creating todo
  Each todo belongs to existing activity or none
  */
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form style={{ width: "500px" }} onFinish={onFinish} form={form}>
        <Form.Item
          label="Title"
          name="todoTitle"
          rules={[{ required: true, message: "Title cannot be empty" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Activity"
          name="todoActivity"
          initialValue=""
          rules={[{ required: false }]}
        >
          {ActivityList.length === 0 ? (
            <Select placeholder="Select Activity">
              <Option value="">None</Option>
            </Select>
          ) : (
            <Select placeholder="Select Activity">
              <Option value="">None</Option>
              {ActivityList.map(function (ele) {
                return <Option value={ele.title}>{ele.title}</Option>;
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Due"
          name="todoDue"
          rules={[{ required: true, message: "DueDay cannot be empty" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="todoPriority"
          rules={[{ required: true, message: "Priority cannot be empty" }]}
        >
          <Rate allowClear={false} defaultValue={1} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="todoDescription"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddList;
