import React, { useEffect, useState, useRef } from "react";
import { lookup } from "../lookup";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";

// All code blow for creating new project
export const ProjectComponent = () => {
  const [newProjects, setNewProjects] = useState([]);
  const [numOfProjects, setNumOfProjects] = useState(null); //to count how many we have at any moment
  const refTitle = useRef();
  const refDescription = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);
  const authState = useSelector((state) => state.auth.isAuthenticated);
  if (!authState) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let title = refTitle.current.value;
    let description = refDescription.current.value;
    if (title.length < 3) {
      alert.show("Title must be at least 3 characters long!", {
        type: "error",
      });
    } else if (title.length > 50) {
      alert.show("Title must be 50 characters or less!", {
        type: "error",
      });
    } else if (description.length < 20) {
      alert.show("Description must be at least 20 characters long!", {
        type: "error",
      });
    } else if (description.length > 1000) {
      alert.show("Description must be 1,000 characters or less!", {
        type: "error",
      });
    } else {
      const data = {
        title: title,
        description: refDescription.current.value,
      };
      let headers = { Authorization: `Token ${authToken}` };

      let tempNewProjects = [...newProjects];

      lookup("post", "projects/create/", data, headers)
        .then((response) => {
          numOfProjects
            ? setNumOfProjects((state) => state + 1)
            : setNumOfProjects(1); //sets num of projects state

          //setNumOfProjects((state) => 1); //sets the total projects to 1
          tempNewProjects.unshift(response.data); //adds new project to total list
          setNewProjects(tempNewProjects); //sets new projects to updated list
          refTitle.current.value = "";
          refDescription.current.value = "";
          setIsClicked(false);
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
        <div className="create-project-form col-12 mb-3 text-center">
          <form className="project-create-form" onSubmit={handleSubmit}>
            {isClicked ? (
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
                      setIsClicked(false);
                    }}
                    className="btn btn-secondary my-2 mx-1"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : null}

            <div className="btn">
              {!isClicked ? (
                <>
                  <button
                    onClick={() => {
                      setIsClicked(true);
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
        setNumOfProjects={setNumOfProjects}
        newProjects={newProjects}
      />
      {numOfProjects === 0 && !isClicked ? (
        <h3 className="mt-3 text-center">
          No Projects? Click on "NEW PROJECT" above to create a new project!
        </h3>
      ) : null}
    </div>
  );
};

// All Below for box view
export const ProjectsList = (props) => {
  const { setNumOfProjects } = props;
  const [projectsInit, setProjectsInit] = useState([]);
  const [projects, setProjects] = useState([]);
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);
  useEffect(() => {
    //if property changes combine initial projects with what is added
    const final = [...props.newProjects].concat(projectsInit);
    if (final.length !== projects.length) {
      setProjects(final);
    }
  }, [projectsInit, projects, props.newProjects]);

  useEffect(() => {
    let headers = { Authorization: `Token ${authToken}` };
    lookup("get", "projects/", {}, headers)
      .then((response) => {
        setProjectsInit(response.data);
        setNumOfProjects(response.data.length); //setting it so we know if we have no projects
      })
      .catch((error) => {
        console.log(error);
        alert.show("Database Error: Trouble loading projects", {
          type: "error",
        });
      });
  }, [alert, authToken, setNumOfProjects]);

  return projects.map((item, index) => {
    return (
      <Project
        setNumOfProjects={setNumOfProjects}
        project={item}
        key={`${index}-item.id`}
      />
    );
  });
};

export const Project = (props) => {
  const { project, setNumOfProjects } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [membersList, setMembersList] = useState(project.members.name);

  useEffect(() => {
    if (isDeleted) setNumOfProjects((state) => state - 1);
  }, [isDeleted, setNumOfProjects]);

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
      day = day.split(1);
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

  return (
    <>
      {!isDeleted ? (
        <>
          <section className="border-top border-bottom">
            <div>
              <div className="row ml-5 mr-2">
                <div className="col-12">
                  <h2 className="mt-2">{project.title}</h2>
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
                        {membersList !== "" ? (
                          <span>
                            <span className="site-color">Members:</span>
                            {` ${membersList}`}
                          </span>
                        ) : (
                          <span>
                            <span className="site-color">Members: </span>Add
                            some members!
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
                  <p className="lead">{project.description}</p>
                </div>
              </div>
              <div className="row justify-content-start mb-4 ml-4">
                <div className="col-md-auto">
                  <ActionMemberBtns
                    project={project}
                    setIsDeleted={setIsDeleted}
                    setMembersList={setMembersList}
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
};

export const ActionMemberBtns = (props) => {
  const { project, setIsDeleted, setMembersList } = props;
  const [isClicked, setIsClicked] = useState(false);
  const refMemberForm = useRef();
  const alert = useAlert();
  const auth = useSelector((state) => state.auth);

  const doDelete = () => {
    let headers = { Authorization: `Token ${auth.token}` };
    lookup("post", `projects/${project.id}/delete/`, {}, headers)
      .then((response) => {
        setIsDeleted(true);
        alert.show("Project successfully deleted!", { type: "success" });
      })
      .catch((error) => {
        let errorMessage = "";
        if (error.response.data.message === undefined) {
          if (error.response.status === 403 || error.response.status === 401) {
            errorMessage = "Database Error: You are not logged in";
          } else {
            errorMessage = error.message;
          }
        } else {
          errorMessage = "Database Error: " + error.response.data.message;
        }
        alert.show(errorMessage, { type: "error" });
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
          setMembersList(response.data.members.name);
          let alertMessage = "Success!";
          if (response.data.message) {
            alertMessage = response.data.message;
            refMemberForm.current.value = "";
          } else if (action === "add") {
            alertMessage = "Success! User " + member + " was added to project";
            refMemberForm.current.value = "";
          } else {
            alertMessage =
              "Success! User " + member + " was removed from project";
          }
          alert.show(alertMessage, { type: "success" });
          refMemberForm.current.value = "";
          setIsClicked(false);
        })
        .catch((error) => {
          let errorMessage = "";
          if (error.response.data.message === undefined) {
            if (
              error.response.status === 403 ||
              error.response.status === 401
            ) {
              errorMessage = "Database Error: You are not logged in";
            } else {
              errorMessage = error.message;
            }
          } else {
            errorMessage = "Database Error: " + error.response.data.message;
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
                  setIsClicked(true);
                }}
                className="brk-btn mx-1"
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
