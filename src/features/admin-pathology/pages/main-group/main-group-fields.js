export const MAIN_GROUP_FIELDS = [
  {
    type: "text",
    name: "groupName",
    label: "Group Name",

    rules: [{ required: true, message: "Group Name is required." }],
  },
  {
    type: "number",
    name: "fee",
    label: "Fee",

    props: { min: 0 },
  },
];
