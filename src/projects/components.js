import React, { useEffect, useState, useRef } from "react";
import { lookup } from "../lookup";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// All code blow for creating new project
export const ProjectComponent = () => {
  const [projects, setProjects] = useState([]);
  const refTitle = useRef();
  const refDescription = useRef();
  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);
  const [projectsLoading, setProjectsLoading] = useState(true);

  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let title = refTitle.current.value;
    let description = refDescription.current.value;
    let message = cleanProjectData(title, description);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else {
      const data = {
        title: title,
        description: refDescription.current.value,
      };
      let headers = { Authorization: `Token ${auth.token}` };

      let tempNewProject = [...projects];

      lookup("post", "projects/create/", data, headers)
        .then((response) => {
          //setNumOfProjects((state) => 1); //sets the total projects to 1
          tempNewProject.unshift(response.data); //adds new project to total list
          setProjects(tempNewProject); //sets new projects to updated list
          refTitle.current.value = "";
          refDescription.current.value = "";
          setIsClickedCreate(false);
          alert.show(
            `Project "${response.data.title}" was successfully created!`,
            { type: "success" }
          );
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
      <div className="row justify-content-md-center">
        <div className="col-12 my-3 mx-auto text-center">
          <h1 className="all-projects-header">All Your Projects</h1>
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
                  placeholder="Project Name"
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
                    New Project
                  </button>
                </>
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <ProjectsList
        setProjectsLoading={setProjectsLoading}
        projects={projects}
        setProjects={setProjects}
        auth={auth}
      />
      {!projectsLoading && projects.length === 0 && !isClickedCreate ? (
        <h3 className="mt-3 text-center">
          No Projects? Click on "NEW PROJECT" above to create a new project!
        </h3>
      ) : null}
    </div>
  );
};

// All Below for box view
export const ProjectsList = (props) => {
  const { setProjects, projects, setProjectsLoading, auth } = props;
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    if(auth.isAuthenticated) {
    let headers = { Authorization: `Token ${authToken}` };
    lookup("get", "projects/", {}, headers)
      .then((response) => {
        setProjects(response.data);
        setProjectsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert.show("Database Error: Trouble loading projects", {
          type: "error",
        });
      });
    }
  }, [alert, authToken, setProjects, setProjectsLoading, auth]);

  return projects.map((item, index) => {
    return (
      <Project
        projects={projects}
        setProjects={setProjects}
        project={item}
        key={`${index}-item.id`}
        ind={index}
      />
    );
  });
};

export const Project = (props) => {
  const { project, setProjects, projects } = props;
  const [isEdtProjectClicked, setIsEdtProjectClicked] = useState(false);
  const authToken = useSelector((state) => state.auth.token);
  const refTitle = useRef();
  const refDescription = useRef();
  const alert = useAlert();

  const onProjectEdtClick = () => {
    let title = refTitle.current.value;
    let description = refDescription.current.value;
    let message = cleanProjectData(title, description);
    if (message !== "") {
      alert.show(message, { type: "error" });
    } else if (project.title === title && project.description === description) {
      alert.show("You didn't change anything!", { type: "error" });
      setIsEdtProjectClicked(false);
    } else {
      let data = {
        title: title,
        description: description,
      };
      let headers = { Authorization: `Token ${authToken}` };

      lookup("post", `projects/${project.id}/update/`, data, headers)
        .then((response) => {
          alert.show(
            `Project "${response.data.title}" was successfully updated!`,
            { type: "success" }
          );

          //setting new array for edit
          let tmpProjArr = projects.map((item) => {
            if (item.id === project.id) {
              let tmpElem = item;
              tmpElem.title = title;
              tmpElem.description = description;
              return tmpElem;
            }
            return item;
          });
          setProjects(tmpProjArr);
          setIsEdtProjectClicked(false);
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
              {!isEdtProjectClicked ? (
                <h2 className="mt-2">{project.title}</h2>
              ) : (
                <h2 className="mt-2">
                  <input
                    className="edit-proj-input"
                    ref={refTitle}
                    defaultValue={project.title}
                  ></input>
                </h2>
              )}
              <div>
                <em>
                  <div>
                    <span className="site-color">Started (PST): </span>
                    {formatDate(project.begin_date)}
                  </div>
                  <div>
                    <span className="site-color">Owner:</span>
                    {` ${project.user.first_name} ${project.user.last_name}`}
                  </div>
                  <div>
                    {project.members.name !== "" ? (
                      <span>
                        <span className="site-color">Members:</span>
                        {` ${project.members.name}`}
                      </span>
                    ) : (
                      <span>
                        <span className="site-color">Members: </span>Add some
                        members!
                      </span>
                    )}
                  </div>
                </em>
              </div>
            </div>
          </div>
          <div className="row pt-2 pt-lg-5 ml-5">
            <div className="col-12 col-md-8 col-lg-7">
              <h5>About</h5>
              {!isEdtProjectClicked ? (
                <p className="lead mr-4">{project.description}</p>
              ) : (
                <p className="lead">
                  <textarea
                    className="edit-proj-textarea"
                    ref={refDescription}
                    defaultValue={project.description}
                  ></textarea>
                </p>
              )}
            </div>
          </div>
          <div className="row justify-content-start mb-4 ml-4">
            {!isEdtProjectClicked ? (
              <>
                <div className="col-md-auto">
                  <ActionMemberBtns
                    setIsEdtProjectClicked={setIsEdtProjectClicked}
                    setProjects={setProjects}
                    projects={projects}
                    project={project}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-md-auto ml-2">
                  <div className="btn">
                    <button
                      onClick={() => {
                        onProjectEdtClick();
                      }}
                      className="helper-btn btn btn-info mx-1"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEdtProjectClicked(false);
                      }}
                      className="btn btn-secondary mx-1"
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
  const { project, setIsEdtProjectClicked, projects, setProjects } = props;
  const [isClicked, setIsClicked] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const refMemberForm = useRef();
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
  }, []);

  const doDelete = () => {
    let headers = { Authorization: `Token ${auth.token}` };
    lookup("post", `projects/${project.id}/delete/`, {}, headers)
      .then((response) => {
        setProjects(
          projects.filter((item) => {
            return item.id !== project.id;
          })
        );
        alert.show("Project successfully deleted!", { type: "success" });
      })
      .catch((error) => {
        alert.show("Oops! something went wrong!", { type: "error" });
      });
  };

  const doAddRemove = (action) => {
    let member = refMemberForm.current.value;
    if (member === "") {
      alert.show("Error: No username typed", { type: "error" });
    } else {
      let data = { id: project.id, action: action, member: member };
      let headers = { Authorization: `Token ${auth.token}` };
      lookup("post", "projects/action/", data, headers)
        .then((response) => {
          //setting new array for edit
          let tmpProjArr = projects.map((item) => {
            if (item.id === project.id) {
              let tmpElem = item;
              tmpElem.members = response.data.members;
              return tmpElem;
            }
            return item;
          });
          setProjects(tmpProjArr);

          let alertMessage = "Success!";
          if (response.data.message) {
            alertMessage = response.data.message;
          } else if (action === "add") {
            alertMessage = "Success! User " + member + " was added to project";
          } else {
            alertMessage =
              "Success! User " + member + " was removed from project";
          }
          alert.show(alertMessage, { type: "success" });
          refMemberForm.current.value = "";
          setIsClicked(false);
        })
        .catch((error) => {
          let errorMessage = "Oops! Something went wrong!";
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorMessage = "Error: " + error.response.data.message;
          }
          alert.show(errorMessage, { type: "error" });
        });
    }
  };
  return (
    <>
      {isClicked ? (
        <>
          <form className="m-1 text-center">
            <input
              required={true}
              className="project-input member-form"
              ref={refMemberForm}
              placeholder="Enter Username"
            ></input>
          </form>
          <div className="btn">
            <button
              onClick={() => {
                doAddRemove("add");
              }}
              className="helper-btn btn btn-info mx-1"
            >
              Add User
            </button>

            <button
              onClick={() => {
                doAddRemove("remove");
              }}
              className="helper-btn btn btn-info mx-1"
            >
              Remove User
            </button>
            <button
              onClick={() => {
                refMemberForm.current.value = "";
                setIsClicked(false);
              }}
              className="btn btn-secondary mx-1"
            >
              Cancel
            </button>
          </div>
        </>
      ) : null}

      {!isClicked ? (
        <div className="btn">
          <Link to={`/sprints/${project.id}`}>
            <button className="brk-btn mx-1">Sprints</button>
          </Link>
          {project.user.username === auth.user.username ? (
            <>
              <button
                onClick={() => {
                  setIsEdtProjectClicked(true);
                }}
                className="brk-btn mx-1"
              >
                Edit Project
              </button>

              {windowSize < 800 ? <br /> : null}

              <button
                onClick={() => {
                  setIsClicked(true);
                }}
                className="brk-btn mx-1 mt-1"
              >
                Edit Members
              </button>
              <button
                onClick={() => {
                  window.confirm(
                    "Are you sure you wish to delete this project?\n This cannot be undone."
                  ) && doDelete();
                }}
                className="brk-btn mx-1"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      ) : null}
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

const cleanProjectData = (title, description) => {
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
