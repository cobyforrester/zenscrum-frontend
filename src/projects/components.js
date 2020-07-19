import React, { useEffect, useState, useRef } from 'react';
import { loadProjects, actionMemberPost } from '../lookup';
  

// All code blow for creating new project
export const ProjectComponent = (props) => {
    const {className} = props
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(event)
    }

    const [isClicked, setIsClicked] = useState(false)
    
    //const refTitle = useRef();


    return <div className={className}>
            <div className='create-project-form col-md-4 mx-auto col-10 my-3'>   
                <form onSubmit={handleSubmit}>
                        {isClicked ? 
                        <textarea name='title' className='form-control my-3' placeholder='Project Name'></textarea>
                        : null }
                        {isClicked ? 
                        <textarea name='description' className='form-control' placeholder='Description'></textarea>
                        : null }
                    <div className='btn btn-group'>
                        {isClicked ? 
                        <button onClick={() => {
                        setIsClicked(false)
                        }} type='submit' className='btn btn-warning my-2 mx-1'>Submit</button>
                        : null }
                        {isClicked ? 
                        <button onClick={() => {
                        setIsClicked(false)
                        }}type='submit' className='btn btn-secondary my-2 mx-1'>Cancel</button>
                        : null }
                        {!isClicked ? 
                        <button onClick={() => {
                        setIsClicked(true)
                        }} type='submit' className='btn btn-success my-2 mx-1'>Create New Project</button>
                        : null }
                    </div>
                </form>
            </div>
            <ProjectsList />
        </div>
    }

// All Below for box view
export const ProjectsList = (props) => {
const [projects, setProjects] = useState([])
useEffect(() => {
    loadProjects().then(response => {
    if(response.status === 200){
        setProjects(response.data);
    }
    }).catch(error => {
    console.log(error)
    });
}, []);
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
    const {project} = props
    let addBtn= {
        className: 'btn btn-success btn-sm mx-1',
        description: 'Add Username',
        type: 'add',
    }
    let rmvBtn= {
        className: 'btn btn-danger btn-sm mx-1',
        description: 'Remove User',
        type: 'remove',
    }
    let edtBtn= {
        className: 'btn btn-info btn-sm mx-1',
        description: 'Add/Remove Members',
        type: 'edit',
    }
    let cnclBtn= {
        className: 'btn btn-light btn-sm mx-1',
        description: 'Cancel',
        type: 'cancel',
    }
    let initialMemberChange = { //for state changes
        clicked: false,
        change: ' d-none',
        neutral: '',
        alertClass: 'd-none',
        alertMessage: '',
    }
    const [memberChange, setMemberChange] = useState(initialMemberChange) //dealing edit btn + add/remove
    const refMemberForm = useRef();
    const clickedFunc = (success, message) => { //This deals with if edit clicked or member added/removed
        if (memberChange.clicked) {
            let alertClass = ' d-none'
            let alertMessage = ''
            if (success === 'success') {
                console.log('success')
                alertClass = 'alert alert-success'
                alertMessage = message
            }
            setMemberChange(prevState => {
                return {
                    ...prevState, 
                    clicked:false, 
                    change: ' d-none', 
                    neutral: '',
                    alertClass: alertClass, 
                    alertMessage: alertMessage,
                }
            })
        }
        else {
            setMemberChange(prevState => {
                return {
                    ...prevState, 
                    clicked:true, 
                    change: '', 
                    neutral: ' d-none',
                    alertClass: 'd-none', 
                    alertMessage: '',
                }
            })
        }
    }

    const doAddRemove = (action) => {
        let member = refMemberForm.current.value
        console.log(member)
        if (member === '') {
            setMemberChange(prevState => {
                return {
                    ...prevState, 
                    alertClass: 'alert alert-danger', 
                    alertMessage: 'Format Error: No username typed',
                }
            });
        }
        else {
            actionMemberPost(project.id, action, member)
            .then(response => {
                if(response.status === 200 || response.status === 201){
                    let alertMessage = ''
                    if (action === 'add') {
                        setMemberChange(prevState => {
                            return {
                                ...prevState, 
                                clicked:false, 
                                change: ' d-none', 
                                neutral: '',
                                alertClass: 'alert alert-success', 
                                alertMessage: member + ' was Added',
                            }
                        });
                        alertMessage = member + ' was Added'
                        refMemberForm.current.value = ''
                    } else {
                        setMemberChange(prevState => {
                            return {
                                ...prevState, 
                                clicked:false, 
                                change: ' d-none', 
                                neutral: '',
                                alertClass: 'alert alert-success', 
                                alertMessage: member + ' Removed',
                            }
                        });
                        alertMessage = member + ' was Removed'
                    }
                    clickedFunc('success', alertMessage);
                }else {
                    setMemberChange(prevState => {
                        return {
                            ...prevState, 
                            alertClass: 'alert alert-danger', 
                            alertMessage: 'Submit Error: ' + response.message,
                        }
                        });
                }
            })
            .catch(error => {
                console.log(error.response.status)
                let errorMessage = ''
                if (error.response.data.message === undefined) {
                    if (error.response.status === 403) {
                        errorMessage = 'Database Error: You are not logged in'
                    }else {
                        errorMessage = error.message
                    }
                }else {
                    errorMessage = 'Database Error: ' + error.response.data.message
                }
                setMemberChange(prevState => {
                    return {
                        ...prevState, 
                        alertClass: 'alert alert-danger', 
                        alertMessage: errorMessage,
                    }
                    });
            });
        }
    }
    return <>
        <div className={memberChange.alertClass} role="alert">
        {memberChange.alertMessage}
        </div>
        <form className={memberChange.change} >
            <textarea className='member-form' ref={refMemberForm}  placeholder="Enter Username"></textarea>
        </form>
        <div className='btn btn-group'>
            <button onClick={() => {
                doAddRemove('add');
            }} className={addBtn.className + memberChange.change} >{addBtn.description}</button>

            <button onClick={() => {
                doAddRemove('remove');
            }} className={rmvBtn.className + memberChange.change} >{rmvBtn.description}</button>

            <button onClick={() => {
                clickedFunc();
            }} className={edtBtn.className + memberChange.neutral} >{edtBtn.description}</button>

            <button onClick={() => {
                refMemberForm.current.value = ''
                clickedFunc();
            }} className={cnclBtn.className + memberChange.change} >{cnclBtn.description}</button>
        </div>
        </>
}
// All below for table view

export const ProjectsListAsTable = (props) => {
    const [projects, setProjects] = useState([])
    useEffect(() => {
        loadProjects().then(response => {
        if(response.status === 200){
            setProjects(response.data);
        }
        }).catch(error => {
        console.log(error)
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