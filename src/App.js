import { useState } from "react";

const initialWorks = [
  { id: 1, description: "Learn Javascript", completed: false },
  { id: 2, description: "Wash clothes", completed: false },
];

export default function App() {
  const [works, setWorks] = useState(initialWorks);
  const [compWorks, setCompWorks] = useState([]);

  function handleAddWork(work) {
    setWorks((works) => [...works, work]);
    console.log(works);
  }

  function handleDeleteWork(selectedWork) {
    console.log(selectedWork);
    selectedWork.completed &&
      setCompWorks((compWorks) => [...compWorks, selectedWork]);

    setWorks((works) => works.filter((work) => work.id !== selectedWork.id));

    console.log(compWorks);
  }

  function handleClearList() {
    setWorks([]);
  }

  function handleToggle(id) {
    setWorks((works) =>
      works.map((work) =>
        work.id === id ? { ...work, completed: !work.completed } : work
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddWork={handleAddWork} />
      <TodoList
        works={works}
        compWorks={compWorks}
        onDeleteWork={handleDeleteWork}
        onClearList={handleClearList}
        onToggleWork={handleToggle}
      />
      <Stats works={works} />
    </div>
  );
}

function Logo() {
  return <h1>Things to do😧</h1>;
}

function Form({ onAddWork }) {
  const [task, setTask] = useState("");

  function handleChange(e) {
    setTask(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!task) return;

    const newWork = { id: Date.now(), description: task, completed: false };
    console.log(newWork);
    onAddWork(newWork);

    setTask("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add new Task🏃‍♀️ </h3>
      <input
        type="text"
        placeholder="Task..."
        value={task}
        onChange={handleChange}
      />
      <button>Add</button>
    </form>
  );
}

function TodoList({
  works,
  compWorks,
  onDeleteWork,
  onClearList,
  onToggleWork,
}) {
  const [sortBy, setSortBy] = useState("input");
  const [showComp, setShowComp] = useState(true);
  let sortedWorks;

  if (sortBy === "input") sortedWorks = works;

  if (sortBy === "description") {
    sortedWorks = works
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === "status")
    sortedWorks = works
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed));

  function handleClick() {
    setShowComp(!showComp);
  }

  return (
    <div className="list">
      <ul>
        {showComp
          ? sortedWorks.map((work) => (
              <Work
                workObj={work}
                key={work.id}
                onDeleteWork={onDeleteWork}
                onToggleWork={onToggleWork}
              />
            ))
          : compWorks.map((work) => (
              <CompWork
                workObj={work}
                key={work.id}
                onDeleteWork={onDeleteWork}
                onToggleWork={onToggleWork}
              />
            ))}
      </ul>
      <div className="actions" onChange={(e) => setSortBy(e.target.value)}>
        <select value={sortBy}>
          <option value="input">Sort by input Order</option>
          <option value="description">Sort by description (A-Z)</option>
          <option value="status">Sort by completed status</option>
        </select>

        <button onClick={onClearList}>Clear List</button>

        <button onClick={handleClick}>Completed tasks</button>
      </div>
    </div>
  );
}

function Work({ workObj, onDeleteWork, onToggleWork }) {
  return (
    <li>
      <input type="checkbox" onChange={() => onToggleWork(workObj.id)} />
      <span style={workObj.completed ? { textDecoration: "line-through" } : {}}>
        {workObj.description}
      </span>
      <button onClick={() => onDeleteWork(workObj)}>❌</button>
    </li>
  );
}

function CompWork({ workObj, onDeleteWork, onToggleWork }) {
  return (
    <li>
      <button>✅</button>
      <span>{workObj.description}</span>
    </li>
  );
}

function Stats({ works }) {
  if (!works.length) {
    return (
      <footer className="stats">Plan your day by adding today's tasks😊</footer>
    );
  }
  const num = works.length;
  const compnum = works.filter((work) => work.completed).length;
  const percentage = Math.round((compnum / num) * 100);

  if (percentage === 100) {
    return (
      <footer className="stats">
        Hurray!!! You completed all your tasks👌
      </footer>
    );
  }
  return (
    <footer className="stats">
      You have {num} tasks on your list, you have completed {compnum} tasks. (
      {percentage}%)
    </footer>
  );
}
