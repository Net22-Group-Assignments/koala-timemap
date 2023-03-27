import { useState } from "react";
import Form from "react-bootstrap/Form";

function CheckProjectStatus(props) {
  const [selectedRadioBtn, setSelectedRadioBtn] = useState("");

  return (
    <Form>
      {["radio"].map((type) => (
        <div key={`inline-${type}`} className="mb-3">
          <Form.Check
            inline
            label="Active"
            name="group1"
            value="Active"
            type={type}
            id={`inline-${type}-1`}
            onChange={(e) => {
              setSelectedRadioBtn(e.target.value);
              props.TimeSummary(selectedRadioBtn);
            }}
          />
          <Form.Check
            inline
            label="Done"
            name="group1"
            value="Done"
            type={type}
            id={`inline-${type}-2`}
            onChange={(e) => {
              setSelectedRadioBtn(e.target.value);
              props.TimeSummary(selectedRadioBtn);
            }}
          />
          <Form.Check
            inline
            label="Next Up"
            name="group1"
            value="Next Up"
            type={type}
            id={`inline-${type}-3`}
            onChange={(e) => {
              setSelectedRadioBtn(e.target.value);
              props.TimeSummary(selectedRadioBtn);
            }}
          />
        </div>
      ))}
    </Form>
  );
}

export default CheckProjectStatus;
