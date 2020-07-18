import React, { useEffect, useState } from 'react';
import {loadProjects} from '../lookup';
  

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

export const ActionMemberBtn = (props) => {
    const {action, className, clickedFunc} = props
    const description = action.description

    //const [clickAddRemove, setClickAddRemove] = useState(false)
    return <>
        <button onClick={() => {
        clickedFunc();
    }} className={className} >{description}</button>
        </>

  }
  
export const Project = (props) => {
const {project} = props;

// INITIAL VALUES FOR STATE, CLICKED = FALSE
let tmpState = {
    clicked: false,
    addBtnClass: 'btn btn-success btn-sm d-none',
    rmvBtnClass: 'btn btn-danger btn-sm d-none',
    edtBtnClass: 'btn btn-info btn-sm',
    memberFormState: 'd-none',
}
const [state, setState] = useState(tmpState) //this is just whether add or not is seen
const clickedFunc = () => { //This deals with if a button is clicked
    if (state.clicked) {
        setState({...state, 
            clicked: false,
            addBtnClass: 'btn btn-success btn-sm d-none',
            rmvBtnClass: 'btn btn-danger btn-sm d-none', 
            edtBtnClass: 'btn btn-info btn-sm',
            memberFormState: 'd-none',
        })
    }
    else {
        setState({...state, 
            clicked: true,
            addBtnClass: 'btn btn-success btn-sm',
            rmvBtnClass: 'btn btn-danger btn-sm',
            edtBtnClass: 'btn btn-info btn-sm d-none', 
            memberFormState: '',
        })
    }
}
useEffect(() => {}, [state]);

return <div className='col-10 mx-auto col-md-6'>

    <div className="card border mb-4 mt-4">
        <div className="card-body">
        <h2 className="card-title">{project.title}</h2>
        <h5 className="card-title">Started: {project.begin_date}</h5>
        <h5 className="card-title">Project Owner {project.user.username}</h5>
        <p className="card-text">{project.description}</p>
        <form className={state.memberFormState}>
            <input type="text"  placeholder="Enter Username" />
        </form>

        <div className='btn btn-group'>
            <ActionMemberBtn clickedFunc={clickedFunc} action={{type: 'add', description: 'Add Username'}} className={state.addBtnClass} />
            <ActionMemberBtn clickedFunc={clickedFunc} action={{type: 'remove', description: 'Remove Username'}} className={state.rmvBtnClass} />
            <ActionMemberBtn clickedFunc={clickedFunc} action={{type: 'edit', description: 'Add/Remove Members'}} className={state.edtBtnClass} />
        </div>
        
  </div>
</div>

</div>
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