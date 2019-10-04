import TailwindTheming from '../src';

it('renders colors', () => {
  const theming = TailwindTheming();
  
  expect(theming.theme).toHaveProperty('colors');
});
