import React, { useEffect, useState, useRef } from "react";
import { lookup } from "../lookup";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// All code blow for creating new project
export const SprintComponent = ({ match }) => {
  const [sprints, setSprints] = useState([]);
  const [project, setProject] = useState({
    user: { username: "", first_name: "", last_name: "" },
  }); //setting for if doesnt load
  const refGoal = useRef();
  const refStartDate = useRef();
  const refEndDate = useRef();
  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  let todayDate = new Date().toISOString().slice(0, 10);
  let newDate = new Date(Date.now() + 12096e5).toISOString().slice(0, 10);

  useEffect(() => {
    if (auth.isAuthenticated) {
      let headers = { Authorization: `Token ${auth.token}` };
      lookup("get", `projects/${match.params.project_id}/`, {}, headers)
        .then((response) => {
          setProject(response.data);
        })
        .catch((error) => {
          console.log(error.response);
          alert.show("Oops! Something went wrong finding sprint!", {
            type: "error",
          });
        });
    }
  }, [auth, alert, setProject, match]);

  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let goal = refGoal.current.value;
    let start_date = refStartDate.current.value;
    let end_date = refEndDate.current.value;
    let message = cleanSprintData(goal, start_date, end_date);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else {
      const data = {
        goal: goal,
        project: match.params.project_id,
        start_date: start_date,
        end_date: end_date,
      };
      let headers = { Authorization: `Token ${auth.token}` };
      let tempNewSprintLst = [...sprints];
      lookup("post", "sprints/create/", data, headers)
        .then((response) => {
          let added = false;
          for (let i = 0; i < sprints.length; i++) {
            if (
              !added &&
              isEarlierDate(
                response.data.start_date,
                tempNewSprintLst[i].start_date
              )
            ) {
              tempNewSprintLst.splice(i, 0, response.data);
              added = !added;
            }
          }
          if (!added) {
            tempNewSprintLst.push(response.data);
          }
          //tempNewSprintLst.unshift(response.data); //adds new sprint to total list
          setSprints(tempNewSprintLst); //sets new sprints to updated list
          refGoal.current.value = "";
          setIsClickedCreate(false);
          alert.show(`Sprint was successfully created!`, { type: "success" });
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
            Back to Projects!
          </button>
        </div>
        <div className="col-12 my-3 mx-auto text-center">
          {project.title && !sprintsLoading !== "" ? (
            <>
              <h1 className="all-projects-header">
                Sprints For "{project.title}"
              </h1>
              <p>(Sorted by start date, and auto-numbered)</p>
            </>
          ) : (
            <>
              {" "}
              <h1 className="all-projects-header">Sprints For... </h1>
              <p>
                <span className="spinner-border spinner-border"></span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-12 mb-3 text-center">
          <form className="mx-1 create-sprint-full" onSubmit={handleSubmit}>
            {isClickedCreate ? (
              <>
                <div className="d-flex justify-content-center input-group date-range-sprints input-daterange">
                  <div className="mt-2 label-sprint">From:</div>
                  <input
                    type="date"
                    ref={refStartDate}
                    className="form-control mx-2"
                    defaultValue={todayDate}
                  />
                  <div className="mt-2 label-sprint">To:</div>
                  <input
                    type="date"
                    ref={refEndDate}
                    className="form-control mx-2"
                    defaultValue={newDate}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <textarea
                    ref={refGoal}
                    required={true}
                    name="description"
                    className="project-input sprint-form-create form-control mt-3"
                    placeholder="Goal of Sprint"
                  ></textarea>
                </div>
                <p className="mt-2">
                  <em>
                    Tip: Try dragging the corner of the goal box for more room!
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
              {!isClickedCreate &&
              project.user.username === auth.user.username ? (
                <>
                  <button
                    onClick={() => {
                      setIsClickedCreate(true);
                    }}
                    className="brk-btn my-2 mx-1"
                  >
                    New Sprint
                  </button>
                </>
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <SprintsList
        setSprintsLoading={setSprintsLoading}
        sprints={sprints}
        setSprints={setSprints}
        project={project}
        match={match}
        auth={auth}
      />
      {!sprintsLoading &&
      sprints.length === 0 &&
      !isClickedCreate &&
      project.user.username === auth.user.username ? (
        <h3 className="mt-3 text-center mx-1">
          No Sprints? Click on "NEW SPRINT" above to create a new sprint!
        </h3>
      ) : null}
      {sprintsLoading ? (
        <p className="mt-3 text-center mx-1">
          <span className="spinner-border spinner-border"></span>
        </p>
      ) : null}
      {!sprintsLoading &&
      sprints.length === 0 &&
      !isClickedCreate &&
      project.user.username !== auth.user.username ? (
        <h3 className="mt-3 text-center mx-1">No Sprints Available!</h3>
      ) : null}
    </div>
  );
};

// All Below for box view
export const SprintsList = (props) => {
  const {
    setSprints,
    sprints,
    setSprintsLoading,
    project,
    match,
    auth,
  } = props;
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (auth.isAuthenticated) {
      let headers = { Authorization: `Token ${authToken}` };
      lookup("get", `sprints/${match.params.project_id}/`, {}, headers)
        .then((response) => {
          setSprints(response.data);
          setSprintsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert.show("Database Error: Trouble loading sprints", {
            type: "error",
          });
        });
    }
  }, [alert, authToken, setSprints, setSprintsLoading, match, auth]);

  return sprints.map((item, index) => {
    return (
      <Sprint
        setSprints={setSprints}
        sprints={sprints}
        project={project}
        sprint={item}
        key={`${index}-item-sprint.id`}
        index={index}
      />
    );
  });
};

export const Sprint = (props) => {
  const { setSprints, sprints, sprint, index, project } = props;
  const [isEdtSprintClicked, setIsEdtSprintClicked] = useState(false);
  const authToken = useSelector((state) => state.auth.token);
  const refGoal = useRef();
  const refStartDate = useRef();
  const refEndDate = useRef();
  const alert = useAlert();

  const onSprintEdtClick = () => {
    let goal = refGoal.current.value;
    let start_date = refStartDate.current.value;
    let end_date = refEndDate.current.value;
    let message = cleanSprintData(goal, start_date, end_date);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else if (
      sprint.goal === goal &&
      sprint.start_date === start_date &&
      sprint.end_date === end_date
    ) {
      alert.show("You didn't change anything!", { type: "error" });
      setIsEdtSprintClicked(false);
    } else {
      let data = {
        goal: goal,
        start_date: start_date,
        end_date: end_date,
      };
      let headers = { Authorization: `Token ${authToken}` };

      lookup("patch", `sprints/${sprint.id}/update/`, data, headers)
        .then((response) => {
          alert.show(`Sprint was successfully updated!`, { type: "success" });
          let tmpElem = null;
          //setting new array for edit
          let tempNewSprintLst = sprints.map((item) => {
            if (item.id === sprint.id) {
              tmpElem = item;
              tmpElem.goal = goal;
              tmpElem.start_date = start_date;
              tmpElem.end_date = end_date;
              return tmpElem;
            }
            return item;
          });
          let tempSprintList2 = tempNewSprintLst.filter((item) => {
            return item.id !== tmpElem.id;
          });
          let added = false;
          for (let i = 0; i < sprints.length - 1; i++) {
            if (
              !added &&
              isEarlierDate(tmpElem.start_date, tempSprintList2[i].start_date)
            ) {
              tempSprintList2.splice(i, 0, tmpElem);
              added = !added;
            }
          }
          if (!added) {
            tempSprintList2.push(tmpElem);
          }
          //tempNewSprintLst.unshift(response.data); //adds new sprint to total list
          setSprints(tempSprintList2); //sets new sprints to updated list
          setIsEdtSprintClicked(false);
          alert.show(`List automatically sorted`, { type: "success" });
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
      <section className="border-top border-bottom">
        <div>
          <div className="row ml-5 mr-2">
            <div className="col-12">
              <h2 className="mt-2">Sprint {index + 1}</h2>
              <div>
                {!isEdtSprintClicked ? (
                  <>
                    <em>
                      <div>
                        <span className="site-color">Start Date (PST): </span>
                        {formatDate(sprint.start_date)}
                      </div>
                      <div>
                        <span className="site-color">End Date (PST): </span>
                        {formatDate(sprint.end_date)}
                      </div>
                    </em>
                  </>
                ) : (
                  <div className="edit-sprint-form">
                    <div className="d-flex">
                      <div className="mt-2">Start:</div>
                      <input
                        type="date"
                        ref={refStartDate}
                        className="form-control mx-2 my-1"
                        defaultValue={sprint.start_date}
                      ></input>
                    </div>
                    <div className="d-flex">
                      <div className="mt-2">End:</div>
                      <input
                        type="date"
                        ref={refEndDate}
                        className="form-control my-1 ml-3 mr-2"
                        defaultValue={sprint.end_date}
                      ></input>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row pt-2 pt-lg-5 ml-5">
            <div className="col-12 col-md-8 col-lg-7">
              <h5>Goal</h5>
              {!isEdtSprintClicked ? (
                <p className="lead mr-4">{sprint.goal}</p>
              ) : (
                <p className="lead">
                  <textarea
                    className="edit-proj-textarea"
                    ref={refGoal}
                    defaultValue={sprint.goal}
                  ></textarea>
                </p>
              )}
            </div>
          </div>
          <div className="row justify-content-start mb-4 ml-4">
            {!isEdtSprintClicked ? (
              <>
                <div className="col-md-auto">
                  <ActionMemberBtns
                    setIsEdtSprintClicked={setIsEdtSprintClicked}
                    setSprints={setSprints}
                    sprints={sprints}
                    sprint={sprint}
                    project={project}
                    index={index}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-md-auto ml-2">
                  <div className="btn">
                    <button
                      onClick={() => {
                        onSprintEdtClick();
                      }}
                      className="helper-btn btn btn-info mx-1"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEdtSprintClicked(false);
                      }}
                      className="btn btn-secondary mx-1 mt-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export const ActionMemberBtns = (props) => {
  const {
    sprint,
    project,
    setIsEdtSprintClicked,
    sprints,
    setSprints,
    index,
  } = props;
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);

  const doDelete = () => {
    let headers = { Authorization: `Token ${auth.token}` };
    lookup("delete", `sprints/${sprint.id}/delete/`, {}, headers)
      .then((response) => {
        setSprints(
          sprints.filter((item) => {
            return item.id !== sprint.id;
          })
        );
        alert.show("Sprint successfully deleted!", { type: "success" });
      })
      .catch((error) => {
        alert.show("Oops! something went wrong!", { type: "error" });
      });
  };

  return (
    <>
      <div className="btn">
        <Link to={`/tasks/${sprint.id}/${index + 1}`}>
          <button className="brk-btn mx-1">Tasks</button>
        </Link>
        {project.user.username === auth.user.username ? (
          <>
            <button
              onClick={() => {
                setIsEdtSprintClicked(true);
              }}
              className="brk-btn mx-1 mt-1"
            >
              Edit Sprint
            </button>

            <button
              onClick={() => {
                window.confirm(
                  "Are you sure you wish to delete this Sprint?\n This cannot be undone."
                ) && doDelete();
              }}
              className="brk-btn mx-1 mt-1"
            >
              Delete
            </button>
          </>
        ) : null}
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

const cleanSprintData = (goal, start_date, end_date) => {
  let message = "";
  if (parseInt(start_date.slice(0, 4)) > parseInt(end_date.slice(0, 4))) {
    message = "Start date cannot be greater than or equal to end date!";
  } else if (
    parseInt(start_date.slice(0, 4)) === parseInt(end_date.slice(0, 4)) &&
    parseInt(start_date.slice(5, 7)) > parseInt(end_date.slice(5, 7))
  ) {
    message = "Start date cannot be greater than or equal to end date!";
  } else if (
    parseInt(start_date.slice(0, 4)) === parseInt(end_date.slice(0, 4)) &&
    parseInt(start_date.slice(5, 7)) === parseInt(end_date.slice(5, 7)) &&
    parseInt(start_date.slice(8, 10)) >= parseInt(end_date.slice(8, 10))
  ) {
    message = "Start date cannot be greater than or equal to end date!";
  } else if (goal.length < 20) {
    message = "Goal must be at least 20 characters long!";
  } else if (goal.length > 1000) {
    message = "Goal must be 1,000 characters or less!";
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
