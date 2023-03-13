import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import TimeSummary from "./TimeSummary";

export default function BasicExample(props) {
  const [showProject, setShowProject] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const handleShowProject = () => setShowProject(true);
  const handleShowPeople = () => setShowPeople(true);
  const handleShowTime = () => setShowTime(true);
  const myTable = (
    <div>
      {/* Här är dropdown menyn */}
      <div className="time_Container"></div>
      <TimeSummary />
      {/* Här är timetable */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan={2}>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  return myTable;
}
