
export const Primary = Template.bind({});
Primary.args = {
  setShowModal: () => {},
  years: [
    { id: 1, year: 2023 },
    { id: 2, year: 2024 },
  ],
  sources: [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Investment' },
  ],
};