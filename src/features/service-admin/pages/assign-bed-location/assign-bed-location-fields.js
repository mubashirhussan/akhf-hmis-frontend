export const ASSIGN_BED_LOCATION_INITIAL_VALUES = {
  wardBedId: undefined,
  roomNumber: undefined,
  bedNumber: undefined,
  location: '',
  price: null,
};

export function getAssignBedLocationFields({
  wardOptions = [],
  roomOptions = [],
  bedOptions = [],
  hasWard = false,
  hasRoom = false,
  isEditMode = false,
} = {}) {
  return [
    {
      type: 'select',
      name: 'wardBedId',
      label: 'Ward Name',
      options: wardOptions,
      rules: [{ required: true, message: 'Ward is required.' }],
      props: {
        showSearch: true,
        optionFilterProp: 'label',
        placeholder: 'Select Ward',
        disabled: isEditMode,
      },
    },
    {
      type: 'select',
      name: 'roomNumber',
      label: 'Room Number',
      options: roomOptions,
      rules: [{ required: true, message: 'Room Number is required.' }],
      props: {
        placeholder: hasWard ? 'Select Room' : 'Select a ward first',
        disabled: !hasWard || isEditMode,
      },
    },
    {
      type: 'select',
      name: 'bedNumber',
      label: 'Bed Number',
      options: bedOptions,
      rules: [{ required: true, message: 'Bed Number is required.' }],
      props: {
        placeholder: hasRoom ? 'Select Bed' : 'Select a room first',
        disabled: !hasRoom || isEditMode,
      },
    },
    {
      type: 'text',
      name: 'location',
      label: 'Location',
      rules: [{ required: true, whitespace: true, message: 'Location is required.' }],
      props: { placeholder: 'e.g. Block A, Row 2' },
    },
    {
      type: 'number',
      name: 'price',
      label: 'Price',
      rules: [{ required: true, message: 'Price is required.' }],
      props: { min: 0, placeholder: 'Enter Price' },
    },
  ];
}
