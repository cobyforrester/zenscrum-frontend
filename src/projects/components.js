import React, { useEffect, useState, useRef } from 'react';
import { loadProjects, actionMemberPost } from '../lookup';
  

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
        className: 'btn btn-success btn-sm',
        description: 'Add Username',
        type: 'add',
    }
    let rmvBtn= {
        className: 'btn btn-danger btn-sm',
        description: 'Remove User',
        type: 'remove',
    }
    let edtBtn= {
        className: 'btn btn-info btn-sm',
        description: 'Add/Remove Members',
        type: 'edit',
    }
    let cnclBtn= {
        className: 'btn btn-light btn-sm',
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
    const clickedFunc = () => { //This deals with if edit clicked or member added/removed
        if (memberChange.clicked) {
            setMemberChange(prevState => {
                return {
                    ...prevState, 
                    clicked:false, 
                    change: ' d-none', 
                    neutral: '',
                    alertClass: 'd-none', 
                    alertMessage: '',
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
            actionMemberPost(project.id, action, member).then(response => {
            if(response.status === 200 || response.status === 201){
                console.log(response.status)
                clickedFunc();
            }
            else {
                console.log(response.message)
            }
            }).catch(error => {
            console.log(error.message)
            setMemberChange(prevState => {
                return {
                    ...prevState, 
                    alertClass: 'alert alert-danger', 
                    alertMessage: 'Submit Error: ' + error.message,
                }
                });
            });
        }
    }
    //const [clickAddRemove, setClickAddRemove] = useState(false)
    return <>
        <div className={memberChange.alertClass} role="alert">
        {memberChange.alertMessage}
        </div>
        <form className={memberChange.change} >
            <input ref={refMemberForm} type="text"  placeholder="Enter Username" />
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