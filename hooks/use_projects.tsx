"use client";

import { GetProjects, UserProjectLocalStorageKey } from "@/lib/utils";
import { Project } from "@/types/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ProjectsProviderContextType {
  projects:Project [];
  relaodProjects : ()=> void 
  saveProjects:(newList: Project[])=>  void
  deleteProject:(id: string)=>  void
}

const ProjectsProviderContext = createContext<ProjectsProviderContextType | undefined>(undefined);

export const ProjectsProviderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = React.useState(GetProjects)

  function relaodProjects () {
    setProjects(GetProjects())
  }

  function deleteProject (id:string) {
   const projects = GetProjects()
   const newProjectList = projects.filter((e)=> e.id !== id)
   saveProjects(newProjectList)
  }

  function saveProjects(newList:Project []) {
    localStorage.setItem(UserProjectLocalStorageKey, JSON.stringify(newList))
    relaodProjects()
  }


  return (
    <ProjectsProviderContext.Provider value={{
      projects,
      relaodProjects,
      deleteProject,
      saveProjects
    }}>
      {children}
    </ProjectsProviderContext.Provider>
  );
};

export const useProjects = (): ProjectsProviderContextType => {
  const context = useContext(ProjectsProviderContext);
  if (!context) {
    throw new Error("useProjectsProvider must be used within a ProjectsProviderProvider");
  }
  return context;
};
