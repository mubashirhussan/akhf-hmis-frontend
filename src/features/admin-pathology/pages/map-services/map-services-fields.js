export const MAP_SERVICES_INITIAL_VALUES = {
  testBookingName: '',
  specimenRequired: '',
  service: undefined,
};

export const getMapServicesFields = ({ services = [] } = {}) => [
  {
    type: 'text',
    name: 'testBookingName',
    label: 'Test Booking Name',
    props: { disabled: true },
  },
  {
    type: 'text',
    name: 'specimenRequired',
    label: 'Specimen Required',
  },
  {
    type: 'select',
    name: 'service',
    label: 'Service',
    options: services,
    props: { allowClear: true },
  },
];
