import { Button, Modal, Tabs, Form, Input, message } from "antd";
import { React, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_LOGIN, CREATE_USER } from "../graphql";
// import { LockOutlined } from "@ant-design/icons";

const LOCALSTORAGE_USER = "userName";
const LOCALSTORAGE_PWD = "password";

const Login = ({ setLogin }) => {
  const [visible, setVisible] = useState(false);
  const { TabPane } = Tabs;
  const [loginForm] = Form.useForm();
  const [signForm] = Form.useForm();
  const [fetch, { called, refetch }] = useLazyQuery(QUERY_LOGIN, {
    variables: {
      userName: loginForm.getFieldsValue().username,
      password: loginForm.getFieldsValue().password,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });
  const [createUser] = useMutation(CREATE_USER);

  const handleClick = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
    loginForm.resetFields();
    signForm.resetFields();
  };

  const onLoginFinish = async (values) => {
    console.log("Success:", values);
    if (!called) {
      const { data } = await fetch();
      if (!data.login) {
        message.error("Wrong username or password!");
        loginForm.resetFields();
        return;
      }
      localStorage.setItem(LOCALSTORAGE_USER, values.username);
      localStorage.setItem(LOCALSTORAGE_PWD, values.password);
      setLogin(true);
      loginForm.resetFields();
      signForm.resetFields();
    } else {
      const { data } = await refetch({
        userName: values.username,
        password: values.password,
      });
      if (!data.login) {
        message.error("Wrong username or password!");
        loginForm.resetFields();
        return;
      }
      localStorage.setItem(LOCALSTORAGE_USER, values.username);
      localStorage.setItem(LOCALSTORAGE_PWD, values.password);
      setLogin(true);
      loginForm.resetFields();
      signForm.resetFields();
    }
  };

  const onLoginFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onSignFinish = async (values) => {
    console.log("Success:", values);
    try {
      await createUser({
        variables: { name: values.username, password: values.password },
      });
      localStorage.setItem(LOCALSTORAGE_USER, values.username);
      localStorage.setItem(LOCALSTORAGE_PWD, values.password);
      setLogin(true);
      loginForm.resetFields();
      signForm.resetFields();
    } catch (e) {
      message.error(e.message);
      signForm.resetFields();
      return;
    }
  };

  const onSignFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div id="magic"></div>
      <div
        className="playground"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "bottom",
        }}
      >
        <Button
          ghost
          size="large"
          style={{ bottom: "-20%" }}
          onClick={handleClick}
        >
          Login
        </Button>
        <Modal
          visible={visible}
          closable={false}
          onCancel={handleCancel}
          footer={null}
          width={400}
          style={{ top: "25%" }}
        >
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Login" key="1">
              <Form
                name="login"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 13,
                }}
                initialValues={{
                  remember: true,
                }}
                form={loginForm}
                onFinish={onLoginFinish}
                onFinishFailed={onLoginFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input Username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input Password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ left: "7.5%" }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Sign Up" key="2">
              <Form
                name="sign"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 13,
                }}
                initialValues={{
                  remember: true,
                }}
                form={signForm}
                onFinish={onSignFinish}
                onFinishFailed={onSignFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input Username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input Password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ left: "7.5%" }}
                  >
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    </>
  );
};

export default Login;
