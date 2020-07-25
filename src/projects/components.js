import React, { useEffect, useState, useRef } from "react";
import { lookup } from "../lookup";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

// All code blow for creating new project
export const ProjectComponent = () => {
  const [newProjects, setNewProjects] = useState([]);
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
    const data = {
      title: refTitle.current.value,
      description: refDescription.current.value,
    };
    let headers = { Authorization: `Token ${authToken}` };

    let tempNewProjects = [...newProjects];

    lookup("post", "projects/create/", data, headers)
      .then((response) => {
        let message = "";
        if (response.status === 201) {
          tempNewProjects.unshift(response.data);
          setNewProjects(tempNewProjects);
          refTitle.current.value = "";
          refDescription.current.value = "";
          setIsClicked(false);
          message =
            "Project " + response.data.title + " was successfully created!";
          alert.show(message, { type: "success" });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.message) {
          alert.show(error.response.message, { type: "error" });
        } else if (error.response && error.response.status === 403) {
          alert.show("Database Error: You are not logged in", {
            type: "error",
          });
        } else if (error.response && error.response.message) {
          alert.show(error.response.message, { type: "error" });
        } else {
          alert.show("Oops! Something went wrong.", { type: "error" });
        }
      });
  };

  return (
    <div className="projects-page">
      <div className="row justify-content-md-center">
        <div className="col-12 my-3 mx-auto text-center">
          <h1 className="all-projects-header">All Your Projects</h1>
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="create-project-form col-12 mb-3 text-center">
          <form onSubmit={handleSubmit}>
            {isClicked ? (
              <textarea
                ref={refTitle}
                required={true}
                name="title"
                className="form-control my-3"
                placeholder="Project Name"
              ></textarea>
            ) : null}
            {isClicked ? (
              <textarea
                ref={refDescription}
                required={true}
                name="description"
                className="form-control"
                placeholder="Description"
              ></textarea>
            ) : null}
            <div className="btn">
              {isClicked ? (
                <button type="submit" className="btn btn-warning my-2 mx-1">
                  Submit
                </button>
              ) : null}
              {isClicked ? (
                <button
                  onClick={() => {
                    setIsClicked(false);
                  }}
                  type="submit"
                  className="btn btn-secondary my-2 mx-1"
                >
                  Cancel
                </button>
              ) : null}
              {!isClicked ? (
                <button
                  onClick={() => {
                    setIsClicked(true);
                  }}
                  type="submit"
                  className="brk-btn my-2 mx-1"
                >
                  New Project
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <ProjectsList newProjects={newProjects} />
    </div>
  );
};

// All Below for box view
export const ProjectsList = (props) => {
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
        if (response.status === 200) {
          setProjectsInit(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        alert.show("Database Error: Trouble loading projects", {
          type: "error",
        });
      });
  }, [alert, authToken]);
  return projects.map((item, index) => {
    return <Project project={item} key={`${index}-item.id`} />;
  });
};

export const Project = (props) => {
  const { project } = props;

  return (
    <>
      <section className="project-block border-top border-bottom">
        <div>
          <div className="row ml-5 mr-2">
            <div className="col-12">
              <h2 className="mt-2">{project.title}</h2>
              <div>
                <em>
                  <div>
                    <span className="site-color">Started: </span>
                    {project.begin_date}
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
              <p className="lead">{project.description}</p>
            </div>
          </div>
          <div className="row justify-content-start mb-4 ml-4">
            <div className="col-md-auto">
              <ActionMemberBtns project={project} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const ActionMemberBtns = (props) => {
  const { project } = props;
  const [isClicked, setIsClicked] = useState(false);
  const refMemberForm = useRef();
  const alert = useAlert();
  const authToken = useSelector((state) => state.auth.token);

  const doAddRemove = (action) => {
    let member = refMemberForm.current.value;
    if (member === "") {
      alert.show("Error: No username typed", { type: "error" });
    } else {
      let data = { id: project.id, action: action, member: member };
      let headers = { Authorization: `Token ${authToken}` };
      lookup("post", "projects/action/", data, headers)
        .then((response) => {
          let alertMessage = "Success!";
          if (response.status === 200 || response.status === 201) {
            if (action === "add") {
              alertMessage =
                "Success! User " + member + " was added to project";
              refMemberForm.current.value = "";
            } else {
              alertMessage =
                "Success! User " + member + " was removed from project";
            }
            alert.show(alertMessage, { type: "success" });
            refMemberForm.current.value = "";
          }
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
      <form className="m-1 text-center">
        {isClicked ? (
          <textarea
            required={true}
            className="member-form"
            ref={refMemberForm}
            placeholder="Enter Username"
          ></textarea>
        ) : null}
      </form>
      <div className="btn">
        {isClicked ? (
          <button
            onClick={() => {
              doAddRemove("add");
            }}
            className="btn btn-success mx-1"
          >
            Add Username
          </button>
        ) : null}

        {isClicked ? (
          <button
            onClick={() => {
              doAddRemove("remove");
            }}
            className="btn btn-danger mx-1"
          >
            Remove User
          </button>
        ) : null}

        {!isClicked ? <button className="brk-btn mx-1">Sprints</button> : null}

        {!isClicked ? (
          <button
            onClick={() => {
              setIsClicked(true);
            }}
            className="brk-btn mx-1"
          >
            Edit Members
          </button>
        ) : null}

        {isClicked ? (
          <button
            onClick={() => {
              refMemberForm.current.value = "";
              setIsClicked(false);
            }}
            className="btn btn-light mx-1"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </>
  );
};
