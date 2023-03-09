import { useEffect, useState } from "react";

export default function GetTime() {
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    fetch("/projects")
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  }, []);

  return (
    <div>
      <ul>
        {projectData &&
          projectData.results.map((project) => (
            <li>
              <span>
                {project.properties.Projectname.title[0].text.content}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
