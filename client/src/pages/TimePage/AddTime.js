import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AddTime(props) {
    const [projectname, setProjectName] = useState('');
    const [status, setStatus] = useState('');
    const [hours, setHours] = useState('');
    const [workedHours, setWorkedHours] = useState('');
    const [hoursLeft, setHoursLeft] = useState('');
    const [timespanStart, setTimespanStart] = useState('');
    const [timespanEnd, setTimespanEnd] = useState('');
    const [show, setShow] = useState(props.show);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button
                onClick={props.toggleShow}
                className="block mx-auto m-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
                + Add Data
            </button>

            <Modal
                show={props.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setProjectName('')
                            setStatus('')
                            setHours('')
                            setWorkedHours('')
                            setHoursLeft('')
                            setTimespanStart('')
                            setTimespanEnd('')
                            props.newProject(projectname, status, hours, timespanStart, timespanEnd);
                        }}
                        id='editmodal'
                        className="w-full max-w-sm">
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="name">
                                    Project Name
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="name"
                                    placeholder='The bestest Project'
                                    type="text"
                                    value={projectname}
                                    onChange={(e) => {
                                        setProjectName(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="industry">
                                    Status
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="industry"
                                    placeholder='Active, Done, Next up'
                                    type="text"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="industry">
                                    Hours
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="industry"
                                    placeholder='Doesnt work yet'
                                    type="text"
                                    value={hours}
                                    onChange={(e) => {
                                        setHours(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="industry">
                                    Timespan Start
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="industry"
                                    placeholder='2000-00-00'
                                    type="text"
                                    value={timespanStart}
                                    onChange={(e) => {
                                        setTimespanStart(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="industry">
                                    Timespan End
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="industry"
                                    placeholder='2000-00-00'
                                    type="text"
                                    value={timespanEnd}
                                    onChange={(e) => {
                                        setTimespanEnd(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                        onClick={props.toggleShow}
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