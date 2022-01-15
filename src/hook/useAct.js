import { useState } from "react";

const useAct = () => {
  const [activity, setActivity] = useState([]);
  const createActivity = (actID) => {
    setActivity([...activity, actID]);
    return actID;
  };
  //   const removeChatBox = (targetKey, activeKey) => {
  //     let i = chatBoxes.indexOf(activeKey);
  //     setChatBoxes(
  //       chatBoxes.filter((e, index) => {
  //         return e !== targetKey;
  //       })
  //     );
  //     if (targetKey !== activeKey) return activeKey;
  //     if (!(chatBoxes.length - 1)) return "";
  //     if (chatBoxes.length - 1 <= i) return chatBoxes[i - 1];
  //     return chatBoxes[i + 1];
  //   };
  return { activity, createActivity };
};

export default useAct;
