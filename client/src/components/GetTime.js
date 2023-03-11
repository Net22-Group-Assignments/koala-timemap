import { useEffect, useState } from "react";

export default function GetTime() {
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    fetch("/timereports")
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
                {console.log(project.properties.Project.relation[0].id)}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
//{project.properties.Projectname.title[0].text.content}
