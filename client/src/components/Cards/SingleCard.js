import Card from "react-bootstrap/Card";

export default function BodyOnly() {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>This is some text within a card body.</Card.Body>
    </Card>
  );
}
