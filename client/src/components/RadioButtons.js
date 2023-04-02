import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function CheckProjectStatus(props) {
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("");

  return (
    <Form
      onChange={(e) => {
        console.log(e.target.value, "CheckProjectStatus");
        props.setSelectedRadioBtn(e.target.value);
      }}
    >
      {["radio"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
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
            defaultChecked
            inline
            label="All projects"
            name="group1"
            value="All"
            type={type}
            id={`inline-${type}-4`}
          />
        </div>
      ))}
    </Form>
  );
}
