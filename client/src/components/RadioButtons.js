import { useState } from "react";
import Form from "react-bootstrap/Form";

import "../pages/TimePage/TimeSummary.css";

export default function CheckProjectStatus(props) {
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("");

  console.log(selectedRadioBtn, "CheckProjectStatus");

  return (
    <Form
      onChange={(e) => {
        props.setSelectedRadioBtn(e.target.value);
      }}
    >
      {["radio"].map((type) => (
        <div
          key={`inline-${type}`}
          className="mb-3 bg-violet-100"
          id="edit_btn"
        >
          <Form.Check
            inline
            label="Active"
            name="group1"
            value="Active"
            type={type}
            id={`inline-${type}-1`}
          />
          <Form.Check
            inline
            label="Done"
            name="group1"
            value="Done"
            type={type}
            id={`inline-${type}-2`}
          />
          <Form.Check
            inline
            label="Next-Up"
            name="group1"
            value="Next-Up"
            type={type}
            id={`inline-${type}-3`}
          />
          <Form.Check
            checked
            inline
            label="All projects"
            name="group1"
            value=""
            type={type}
            id={`inline-${type}-4`}
          />
        </div>
      ))}
    </Form>
  );
}
