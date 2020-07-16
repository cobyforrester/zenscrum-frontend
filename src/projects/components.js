import React, {useEffect, useState} from 'react';
import {loadProjects} from '../lookup'
  
export const ProjectsList = (props) => {
const [projects, setProjects] = useState([])
useEffect(() => {
    loadProjects().then(response =>{
    if(response.status === 200){
        setProjects(response.data);
    }
    }).catch(error =>{
    console.log(error)
    });
}, []);
return projects.map((item, index) => {
    return <Project project = {item} key={`${index}-item.id`} />
})
}


export const ActionBtn = (props) => {
    const {action, className} = props
    return <button className={className}>{action}</button>
  }
  
export const Project = (props) => {
const {project} = props
const addBtnClass = 'btn btn-success btn-sm'
const RmvBtnClass = 'btn btn-danger btn-sm'
return <div className='col-10 mx-auto col-md-6'>
    <p>{project.id} - {project.title}</p>
    <div className='btn btn-group'>
    <ActionBtn action={'Add To Project'} className={addBtnClass} />
    <ActionBtn action={'Remove From Project'} className={RmvBtnClass} />
    </div>
</div>
}