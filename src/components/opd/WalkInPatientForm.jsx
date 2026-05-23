'use client'
import { Tabs } from "antd";

const onChange = key => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Search Existing',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Add New Record',
    children: 'Add New Record',
  },
 
];
export default function WalkInPatientForm() {
return(
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
)
}
