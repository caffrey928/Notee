import React from "react";
import TodoList from "./TodoList";
import ActivityList from "./ActivityList";
import AddList from "./AddList";

const UserContent = ({
  Current,
  setSeeForm,
  setFormMode,
  currentAct,
  setCurrentAct,
  actLock,
  setActLock,
  setTodoID,
}) => {
  const switchAnswer = () => {
    switch (Current) {
      case "Todo":
        return (
          <TodoList
            setSeeForm={setSeeForm}
            setFormMode={setFormMode}
            setActLock={setActLock}
            setTodoID={setTodoID}
          />
        );
      case "Activity":
        return (
          <ActivityList
            setSeeForm={setSeeForm}
            setFormMode={setFormMode}
            currentAct={currentAct}
            setCurrentAct={setCurrentAct}
            setActLock={setActLock}
            setTodoID={setTodoID}
          />
        );
      case "Add":
        return <AddList />;
      default:
        return <TodoList />;
    }
  };
  return (
    <div>
      {/* {Current === "Todo" ? (
        <TodoList />
      ) : (
        <ActivityList setSeeForm={setSeeForm} />
      )} */}
      {switchAnswer()}
    </div>
  );
};

export default UserContent;
