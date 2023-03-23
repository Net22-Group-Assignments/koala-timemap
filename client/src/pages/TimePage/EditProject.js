import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useAuthUser } from "react-auth-kit";

export default function EditProject(props) {
  const [projectname, setProjectName] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState("");
  const [editProject, setEditProject] = useState("");
  const [showEditProject, setShowEditProject] = useState(props.show);

  console.log(props.projects);
  const projectOptions = props.projects.map((project) => ({
    value: project.id,
    label: project.properties.Projectname.title[0].text.content,
  }));

  const handleEditProjectChange = (selectedProject) => {
    setEditProject(
      props.projects.find((project) => project.id === selectedProject.value)
    );
  };

  const handleClose = () => setShowEditProject(false);
  const handleShow = () => setShowEditProject(true);

  return (
    <>
      <button
        onClick={props.toggleShowEditProject}
        className="m-2 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      >
        Update
      </button>

      <Modal
        show={props.showEditProject}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Update Project Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setProjectName("");
              setStatus("");
              setHours("");
              props.projectEdit(editProject.id, status, hours);
            }}
            id="editmodal"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="name"
                >
                  Project Name
                </label>
              </div>
              <div className="md:w-2/3">
                <Select
                  options={projectOptions}
                  onChange={handleEditProjectChange}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="industry"
                >
                  Status
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="Active, Done, Next up"
                  type="text"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  for="industry"
                >
                  Hours
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="0"
                  type="text"
                  value={hours}
                  onChange={(e) => {
                    setHours(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.toggleShowEditProject}
          >
            Close
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            form="editmodal"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
