import React, {useEffect, useState} from 'react';
import {loadProjects} from '../lookup'
  
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
    //const {action, className} = props
    const description = {
        addMember: 'Add Username',
        removeMember: 'Remove Username',
        edit: 'Edit Member List',
        cancel: 'Cancel',
    }
    const className = {
        addBtnClass: 'btn btn-success btn-sm',
        removeBtnClass: 'btn btn-danger btn-sm',
        cancelBtnClass: 'btn btn-light btn-sm',
        neutralBtnClass: 'btn btn-info btn-sm',
    }

    const [clickAddRemove, setClickAddRemove] = useState(false)
    if(!clickAddRemove) {
    return <div>
        <form>
            <button className={className.neutralBtnClass} 
            onClick={() => {
                setClickAddRemove(!clickAddRemove);
                
                }}>
                {description.edit}</button>
            <input type="text" name="" /> 
        </form>
        </div >
    }
    else {
        return <div>
        <form>
            <button className={className.removeBtnClass} 
            onClick={() => {
                setClickAddRemove(!clickAddRemove);
                
                }}>
                {description.edit}</button>
            <input type="text" name="" /> 
        </form>
        </div >

    }
}
  
export const Project = (props) => {
const {project} = props
return <div className='col-10 mx-auto col-md-6'>
    <p>{project.id} - {project.title}</p>
    <div className='btn btn-group'>
    <ActionMemberBtn />
    </div>
</div>
}