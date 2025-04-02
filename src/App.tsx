import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";

const App: React.FC = () => {
  return (
    <div>
      <Header title="KEPCO Ver 2" />
      <Main />
    </div>
  );
};

export default App;
