import React, { useEffect, useState, useRef } from "react";
import { lookup } from "../lookup";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

// All code blow for creating new project
export const TaskComponent = ({ match }) => {
  //match id is sprint id in match.params.id
  const [tasks, setTasks] = useState([]);
  const refTitle = useRef();
  const refDescription = useRef();
  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);
  const [tasksLoading, setTasksLoading] = useState(true);
  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let title = refTitle.current.value;
    let description = refDescription.current.value;
    let message = cleanTaskData(title, description);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else {
      const data = {
        sprint: match.params.sprint_id,
        title: title,
        description: description,
      };
      let headers = { Authorization: `Token ${auth.token}` };
      let tempNewTaskLst = [...tasks];
      lookup("post", "tasks/create/", data, headers)
        .then((response) => {
          let added = false;
          for (let i = 0; i < tasks.length; i++) {
            if (!added && tempNewTaskLst[i].completed) {
              if (!added) {
                tempNewTaskLst.splice(i, 0, response.data);
                added = !added;
              }
            }
          }
          if (!added) {
            tempNewTaskLst.push(response.data);
          }
          setTasks(tempNewTaskLst); //sets new tasks to updated list
          refTitle.current.value = "";
          refDescription.current.value = "";
          setIsClickedCreate(false);
          alert.show(`Task was successfully created!`, { type: "success" });
          alert.show(`List automatically sorted`, { type: "success" });
        })
        .catch((error) => {
          console.log(error.response);
          alert.show("Oops! Something went wrong submitting!", {
            type: "error",
          });
        });
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="arrow-btn mt-3 ml-5"
          >
            Back to Sprints!
          </button>
        </div>
        <div className="col-12 my-3 mx-auto text-center">
          <h1 className="all-projects-header">
            Tasks For Sprint {match.params.sprint_num}
          </h1>
          <p>(Sorted by completeness, then most recent date first)</p>
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-12 mb-3 text-center">
          <form className="project-create-form" onSubmit={handleSubmit}>
            {isClickedCreate ? (
              <>
                <input
                  ref={refTitle}
                  required={true}
                  name="title"
                  className="project-input form-control my-3"
                  placeholder="Task Name"
                ></input>
                <textarea
                  ref={refDescription}
                  required={true}
                  name="description"
                  className="project-input form-control"
                  placeholder="Description"
                ></textarea>
                <p className="mt-2">
                  <em>
                    Tip: Try dragging the corner of the description box for more
                    room!
                  </em>
                </p>
                <div className="btn">
                  <button
                    type="submit"
                    className="helper-btn btn btn-info my-2 mx-1"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsClickedCreate(false);
                    }}
                    className="btn btn-secondary my-2 mx-1"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : null}

            <div className="btn">
              {!isClickedCreate ? (
                <>
                  <button
                    onClick={() => {
                      setIsClickedCreate(true);
                    }}
                    className="brk-btn my-2 mx-1"
                  >
                    New Task
                  </button>
                </>
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <ul className="cards">
        <TasksList
          setTasksLoading={setTasksLoading}
          tasks={tasks}
          setTasks={setTasks}
          match={match}
          auth={auth}
        />
      </ul>
      {!tasksLoading && tasks.length === 0 && !isClickedCreate ? (
        <h3 className="mt-3 text-center mx-1">
          No Tasks? Click on "NEW TASK" above to create a new task!
        </h3>
      ) : null}
      {tasksLoading ? (
        <p className="mt-3 text-center mx-1">
          <span className="spinner-border spinner-border"></span>
        </p>
      ) : null}
    </div>
  );
};

// All Below for box view
export const TasksList = (props) => {
  const { setTasks, tasks, setTasksLoading, match, auth } = props;
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (auth.isAuthenticated) {
      let headers = { Authorization: `Token ${authToken}` };
      lookup("get", `tasks/${match.params.sprint_id}/`, {}, headers)
        .then((response) => {
          setTasks(response.data);
          setTasksLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert.show("Database Error: Trouble loading tasks", {
            type: "error",
          });
        });
    }
  }, [alert, authToken, setTasks, setTasksLoading, match, auth]);

  return tasks.map((item, index) => {
    return (
      <Task
        tasks={tasks}
        setTasks={setTasks}
        task={item}
        key={`${index}-item-sprint.id`}
      />
    );
  });
};

export const Task = (props) => {
  const { setTasks, task, tasks } = props;
  const [isEdtTaskClicked, setIsEdtTaskClicked] = useState(false);
  const authToken = useSelector((state) => state.auth.token);
  const refTitle = useRef();
  const refDescription = useRef();
  const alert = useAlert();
  let cardColor = "";
  if (task.completed) {
    cardColor = "card-color";
  }

  const onTaskEdtClick = () => {
    let title = refTitle.current.value;
    let description = refDescription.current.value;
    let message = cleanTaskData(title, description);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else if (task.title === title && task.description === description) {
      alert.show("You didn't change anything!", { type: "error" });
      setIsEdtTaskClicked(false);
    } else {
      let data = {
        title: title,
        description: description,
        completed: task.completed,
      };
      let headers = { Authorization: `Token ${authToken}` };

      lookup("patch", `tasks/${task.id}/update/`, data, headers)
        .then((response) => {
          alert.show(`Task was successfully updated!`, { type: "success" });
          let tmpElem = null;
          //setting new array for edit
          let tempTasksLst = tasks.map((item) => {
            if (item.id === task.id) {
              tmpElem = item;
              tmpElem.title = title;
              tmpElem.description = description;
              return tmpElem;
            }
            return item;
          });
          //tempNewSprintLst.unshift(response.data); //adds new sprint to total list
          setTasks(tempTasksLst); //sets new sprints to updated list
          setIsEdtTaskClicked(false);
        })
        .catch((error) => {
          console.log(error.response);
          alert.show("Oops! Something went wrong updating!", {
            type: "error",
          });
        });
    }
  };

  return (
    <>
      <li className="cards_item">
        <div className={`card ${cardColor}`}>
          <div className="card_content">
            {!isEdtTaskClicked ? (
              <>
                <h2 className="card_title border-bottom mb-2">{task.title}</h2>

                <p className="card_text">
                  <em>
                    <strong className="text-light">Start Date (PST): </strong>
                    {formatDate(task.start_date)}
                  </em>
                </p>
                <p className="card_text">
                  <strong className="text-light">Description: </strong>
                  {task.description}
                </p>
              </>
            ) : (
              <>
                <div className="task-update-form">
                  <input
                    className="custom-column-header"
                    ref={refTitle}
                    defaultValue={task.title}
                  ></input>
                  <textarea
                    className="custom-column-content"
                    ref={refDescription}
                    defaultValue={task.description}
                  ></textarea>
                </div>
              </>
            )}

            {!isEdtTaskClicked ? (
              <ActionMemberBtns
                setIsEdtTaskClicked={setIsEdtTaskClicked}
                tasks={tasks}
                setTasks={setTasks}
                task={task}
              />
            ) : (
              <div className="btn">
                <button
                  onClick={() => {
                    onTaskEdtClick();
                  }}
                  className="btn btn-light mx-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEdtTaskClicked(false);
                  }}
                  className="btn btn-dark mx-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    </>
  );
};

export const ActionMemberBtns = (props) => {
  const { task, setIsEdtTaskClicked, tasks, setTasks } = props;
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);

  const handleCheck = () => {
    let data = {
      title: task.title,
      description: task.description,
      completed: !task.completed,
    };
    let headers = { Authorization: `Token ${auth.token}` };
    lookup("post", `tasks/${task.id}/update/`, data, headers)
      .then((response) => {
        alert.show(`Task was successfully updated!`, { type: "success" });
        let tmpElem = response;
        //setting new array for edit
        let tempTasksLst = tasks
          .map((item) => {
            if (item.id === task.id) {
              tmpElem = item;
              tmpElem.completed = response.data.completed;
              return tmpElem;
            }
            return item;
          })
          .filter((item) => {
            return item.id !== tmpElem.id;
          });
        let added = false;
        for (let i = 0; i < tasks.length - 1; i++) {
          let bool =
            isEarlierDate(tmpElem.start_date, tempTasksLst[i].start_date) &&
            tempTasksLst[i].completed === tmpElem.completed;
          if (bool || (tempTasksLst[i].completed && !tmpElem.completed)) {
            if (!added) {
              tempTasksLst.splice(i, 0, tmpElem);
              added = !added;
            }
          }
        }
        if (!added) {
          tempTasksLst.push(tmpElem);
        }
        //tempNewSprintLst.unshift(response.data); //adds new sprint to total list
        setTasks(tempTasksLst); //sets new sprints to updated list
        alert.show(`List automatically sorted`, { type: "success" });
      })
      .catch((error) => {
        console.log(error);
        alert.show("Oops! Something went wrong updating!", {
          type: "error",
        });
      });
  };

  const doDelete = () => {
    let headers = { Authorization: `Token ${auth.token}` };
    lookup("delete", `tasks/${task.id}/delete/`, {}, headers)
      .then((response) => {
        setTasks(
          tasks.filter((item) => {
            return item.id !== task.id;
          })
        );
        alert.show("Task successfully deleted!", { type: "success" });
      })
      .catch((error) => {
        alert.show("Oops! something went wrong!", { type: "error" });
      });
  };

  return (
    <>
      <div className="btn">
        <button
          onClick={() => {
            setIsEdtTaskClicked(true);
          }}
          className="btn btn-light mx-1"
        >
          Edit Task
        </button>
        <button
          onClick={() => {
            window.confirm(
              "Are you sure you wish to delete this Task?\n This cannot be undone."
            ) && doDelete();
          }}
          className="btn btn-dark mx-1"
        >
          Delete
        </button>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={task.completed || false}
          onChange={() => {
            handleCheck();
          }}
        />
        <label className="form-check-label text-light">Completed</label>
      </div>
    </>
  );
};

// HELPER FUNCTIONS

const formatDate = (date) => {
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8);
  let month_names = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };
  if (day[0] === "0") {
    day = day.slice(1);
  }
  if (day === "1") {
    day = day + "st";
  } else if (day === "2") {
    day = day + "nd";
  } else if (day === "3") {
    day = day + "rd";
  } else {
    day = day + "th";
  }
  return `${month_names[month]} ${day}, ${year}`;
};

const cleanTaskData = (title, description) => {
  let message = "";
  if (title.length < 3) {
    message = "Title must be at least 3 characters long!";
  } else if (title.length > 50) {
    message = "Title must be 50 characters or less!";
  } else if (description.length < 20) {
    message = "Description must be at least 20 characters long!";
  } else if (description.length > 1000) {
    message = "Description must be 1,000 characters or less!";
  }
  return message;
};

const isEarlierDate = (date1, date2) => {
  //returns true if date1 is earlier or equal to date2
  if (parseInt(date1.slice(0, 4)) > parseInt(date2.slice(0, 4))) {
    return false;
  } else if (
    parseInt(date1.slice(0, 4)) === parseInt(date2.slice(0, 4)) &&
    parseInt(date1.slice(5, 7)) > parseInt(date2.slice(5, 7))
  ) {
    return false;
  } else if (
    parseInt(date1.slice(0, 4)) === parseInt(date2.slice(0, 4)) &&
    parseInt(date1.slice(5, 7)) === parseInt(date2.slice(5, 7)) &&
    parseInt(date1.slice(8, 10)) > parseInt(date2.slice(8, 10))
  ) {
    return false;
  }
  return true;
};
