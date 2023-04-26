import { useState } from "react";
import React from "react";





const ProjectDescriptionTab = (project) => {

  const [theprojectDescription,setTheProjectDescription] = useState('')



  React.useEffect(() => {
    setTheProjectDescription("The New shit")
    return ()=>{console.log("UnMounted")}
  }, []);


  return(
    <>
      {theprojectDescription}
    </>
  );
};

export default ProjectDescriptionTab;