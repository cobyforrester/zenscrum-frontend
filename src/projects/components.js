import React, { useEffect, useState, useRef } from 'react';
import { lookup } from '../lookup';
import { login } from '../actions';
import { useAlert } from 'react-alert';
import { useSelector, useDispatch } from 'react-redux';
  

// All code blow for creating new project
export const ProjectComponent = (props) => {
    const {className} = props;
    const [newProjects, setNewProjects] = useState([]);

    const refTitle = useRef();
    const refDescription = useRef();

    const [isClicked, setIsClicked] = useState(false);

    const alert = useAlert();

    //testing 
    const authState = useSelector(state => state);
    const dispatch = useDispatch();


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            title: refTitle.current.value,
            description: refDescription.current.value
        };

        let tempNewProjects = [...newProjects];

        lookup('post', 'projects/create/', data, {}).then(response => {
            let message = ''
            if(response.status === 201){
                tempNewProjects.unshift(response.data);
                setNewProjects(tempNewProjects);
                refTitle.current.value = '';
                refDescription.current.value = '';
                setIsClicked(false);
                message = 'Project ' + response.data.title + ' was successfully created!';
                alert.show(message, {type: 'success'});

            }
            }).catch(error => {
            console.log(error);
            if (error.response && error.response.message) {
                alert.show(error.response.message, {type: 'error'});
            } else if (error.response && error.response.status === 403) {
                alert.show('Database Error: You are not logged in', {type: 'error'});
            } else if (error.response){
                alert.show(error.response.message, {type: 'error'});
            } else {
                alert.show('Oops! Something went wrong.', {type: 'error'});
            }
            });
    }

    

    return <div className={className}>
            <div className='create-project-form col-md-4 mx-auto col-10 my-3'> 
            <div>
                <button onClick={() => {
                    login('shan', '123456', dispatch);
                }}className='btn btn-success'>LOGIN</button>
                <button onClick={() => {
                    
                }}className='btn btn-danger'>LOGOUT</button>
                <p>{}</p>
            </div>

            <button onClick={()=> {


                let headers =  {
                        'Content-Type': 'application/json',
                    };
                
                let data = {
                    username: 'shan',
                    email: "shan@gmail.com",
                    password: "123456",
                };

                lookup('post', 'auth/login/', data, headers).then(response => {
                    //alert.show(response);
                    let token = response.data.token;
                    headers.Authorization = `Token ${token}`;
                    data = {title: 'hello', description: 'yes'};
                    lookup('post', 'projects/create/', {}, headers).then(response => {
                        //alert.show(response)
                        console.log(response);
    
                        
                        }).catch(error => {
                        console.log(error);
                        alert.show('Something went wrong!', {type: 'error'});
                        });

                    }).catch(error => {
                    console.log(error);
                        alert.show('Something went wrong!', {type: 'error'});
                    });
            }}className='btn btn-danger btn-lg'>TEST</button>

                <form onSubmit={handleSubmit}>
                        {isClicked ? 
                        <textarea ref={refTitle} required={true} name='title' className='form-control my-3' placeholder='Project Name'></textarea>
                        : null }
                        {isClicked ? 
                        <textarea ref={refDescription} required={true} name='description' className='form-control' placeholder='Description'></textarea>
                        : null }
                    <div className='btn btn-group'>
                        {isClicked ? 
                        <button type='submit' className='btn btn-warning my-2 mx-1'>Submit</button>
                        : null }
                        {isClicked ? 
                        <button onClick={() => {
                        setIsClicked(false);
                        }}type='submit' className='btn btn-secondary my-2 mx-1'>Cancel</button>
                        : null }
                        {!isClicked ? 
                        <button onClick={() => {
                        setIsClicked(true);
                        }} type='submit' className='btn btn-success my-2 mx-1'>Create New Project</button>
                        : null }
                    </div>
                </form>
            </div>
            <ProjectsList newProjects={newProjects} />
        </div>
    }

// All Below for box view
export const ProjectsList = (props) => {
const [projectsInit, setProjectsInit] = useState([]);
const [projects, setProjects] = useState([]);
const alert = useAlert();
useEffect(() => { //if property changes combine initial projects with what is added
    const final = [...props.newProjects].concat(projectsInit);
    if (final.length !== projects.length) {
        setProjects(final);
    }
}, [projectsInit, projects, props.newProjects]);

useEffect(() => {
    lookup('get', 'projects/', {}, {}).then(response => {
    if(response.status === 200){
        setProjectsInit(response.data);
    }
    }).catch(error => {
    console.log(error);
    alert.show('Database Error: Trouble loading projects', {type: 'error'});
    });
}, [alert]);
return projects.map((item, index) => {
    return <Project project = {item} key={`${index}-item.id`} />

})
}

export const Project = (props) => {
const {project} = props;

return <div className='col-10 mx-auto col-md-6'>

    <div className="card border mb-4 mt-4">
        <div className="card-body">
        <h2 className="card-title">{project.title}</h2>
        <h5 className="card-title">Started: {project.begin_date}</h5>
        <h5 className="card-title">Project Owner {project.user.username}</h5>
        <p className="card-text">{project.description}</p>
        <ActionMemberBtns project={project} />
        </div>
    </div>
</div>
}

export const ActionMemberBtns = (props) => {
    const {project} = props;
    const [isClicked, setIsClicked] = useState(false);
    const refMemberForm = useRef();
    const alert = useAlert();

    const doAddRemove = (action) => {
        let member = refMemberForm.current.value;
        if (member === '') {
            alert.show('Error: No username typed', {type: 'error'});
        }
        else {
            lookup('post', 'projects/action/', {id:project.id, action: action, member: member}, {})
            .then(response => {
                let alertMessage = 'Success!';
                if(response.status === 200 || response.status === 201){
                    if (action === 'add') {

                        alertMessage = 'Success! User ' + member + ' was added to project';
                        refMemberForm.current.value = '';
                    } else {
                        alertMessage = 'Success! User ' + member + ' was removed from project';
                    }
                    alert.show(alertMessage, {type: 'success'});
                    refMemberForm.current.value = '';
                }
            })
            .catch(error => {
                let errorMessage = '';
                if (error.response.data.message === undefined) {
                    if (error.response.status === 403) {
                        errorMessage = 'Database Error: You are not logged in';
                    }else {
                        errorMessage = error.message;
                    }
                }else {
                    errorMessage = 'Database Error: ' + error.response.data.message;
                }
                alert.show(errorMessage, {type: 'error'});
            });
        }
    }
    return <>
        <form>
        {isClicked ? 
            <textarea required={true} className='member-form' ref={refMemberForm}  placeholder="Enter Username"></textarea>
        : null}
        </form>

        <div className='btn btn-group'>
            {isClicked ? 
                <button onClick={() => {
                    doAddRemove('add');
                }} className='btn btn-success btn-sm mx-1'>Add Username</button>
            : null}

            {isClicked ?
                <button onClick={() => {
                    doAddRemove('remove');
                }} className='btn btn-danger btn-sm mx-1'>Remove User</button>
            : null}

            {!isClicked ? 
                <button onClick={() => {
                    setIsClicked(true);
                }} className='btn btn-info btn-sm mx-1' >Add/Remove Members</button>
            : null}

            {isClicked ? 
                <button onClick={() => {
                    refMemberForm.current.value = '';
                    setIsClicked(false);
                }} className='btn btn-light btn-sm mx-1' >Cancel</button>
            : null}
        </div>
        </>
}
// All below for table view

export const ProjectsListAsTable = (props) => {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        lookup('get', 'projects/', {}, {}).then(response => {
        if(response.status === 200){
            setProjects(response.data);
        }
        }).catch(error => {
        console.log(error);
        });
    }, []);
    return <div className='container'>
        <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Owner</th>
            <th scope="col">Members</th>
          </tr>
        </thead>
        <tbody>
            {projects.map((item, index) => 
                <tr >
                    <th scope="row">{index + 1}</th>
                    <td>{item.title}</td>
                    <td>{item.user.username}</td>
                    <td>{item.begin_date}</td>
                </tr>
            )}
        </tbody>
      </table>
      </div>
    }