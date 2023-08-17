import React from "react";

import { useDataBaseContext } from "@/contexts/DataBaseContext";


const ProjectDescriptionTab = () => {


  const {
    selectedProject,
  } = useDataBaseContext();


  return(
    <>
      {selectedProject.description}
    </>
  );
};

export default ProjectDescriptionTab;