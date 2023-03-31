import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { StatusSelect } from "../../components/StatusSelect";

export default function AddProject(props) {
  const [projectname, setProjectName] = useState("");
  const [status, setStatus] = useState("Next-Up");
  const [hours, setHours] = useState("0");
  const [workedHours, setWorkedHours] = useState("");
  const [hoursLeft, setHoursLeft] = useState("");
  const [timespanStart, setTimespanStart] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [timespanEnd, setTimespanEnd] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showProject, setShowProject] = useState(props.show);

  const handleClose = () => setShowProject(false);
  const handleShow = () => setShowProject(true);

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus.value);
  };

  return (
    <>
      <button
        onClick={props.toggleShowProject}
        className="m-2 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      >
        Add Project
      </button>

      <Modal
        show={props.showProject}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              try {
                props.newProject(
                  projectname,
                  status,
                  hours,
                  timespanStart,
                  timespanEnd
                );
                console.log("Project added");
                console.log("run refetch");
                props.refetch();
              } catch (e) {
                console.error(e);
              }
              e.preventDefault();
              setProjectName("");
              setStatus("Next-Up");
              setHours("0");
              setWorkedHours("0");
              setHoursLeft("0");
              setTimespanStart(new Date().toISOString().slice(0, 10));
              setTimespanEnd(new Date().toISOString().slice(0, 10));
              props.toggleShowProject();
            }}
            id="editmodal"
            className="w-full max-w-sm"
          >
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="name"
                >
                  Project Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  placeholder="The bestest Project"
                  type="text"
                  value={projectname}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  required={true}
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
                <StatusSelect value={status} onChange={handleStatusChange} />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
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
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Project Start
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="2000-00-00"
                  type="date"
                  value={timespanStart}
                  onChange={(e) => {
                    setTimespanStart(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="industry"
                >
                  Project End
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="industry"
                  placeholder="2000-00-00"
                  type="date"
                  value={timespanEnd}
                  onChange={(e) => {
                    setTimespanEnd(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            onClick={props.toggleShowProject}
          >
            Close
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            form="editmodal"
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
