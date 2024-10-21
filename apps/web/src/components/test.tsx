import {Checkbox} from "@nextui-org/react";

export default function BunchofBox() {
  return (
    <div className="flex gap-4">
      <Checkbox>Normal</Checkbox>
      <Checkbox defaultSelected color="default">Default</Checkbox>
      <Checkbox defaultSelected color="primary">Primary</Checkbox>
      <Checkbox defaultSelected color="secondary">Secondary</Checkbox>
      <Checkbox defaultSelected color="success">Success</Checkbox>
      <Checkbox defaultSelected color="warning">Warning</Checkbox>
      <Checkbox defaultSelected color="danger">Danger</Checkbox>
    </div> 
  );
}