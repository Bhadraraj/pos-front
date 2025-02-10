import React from 'react';
import { Segmented, Tabs } from 'antd';
import HotDishes from './menus/HotDishes'
import Dessert from './menus/Dessert'
import ColdDishes from './menus/ColdDishes'
import Briyanis from './menus/Briyanis'
import Teas from './menus/Teas'

import '../styles/menus.css'
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: '1',
    label: 'Hot Dishes',
    children: <HotDishes />,
  },
  {
    key: '2',
    label: 'Cold Dishes',
    children: <ColdDishes />,
  },
  {
    key: '3',
    label: 'Dessert ',
    children: <Dessert />,
  },
  {
    key: '4',
    label: 'Briyani ',
    children: <Briyanis />,
  },
  {
    key: '5',
    label: 'Tea ',
    children: <Teas />,
  },
];
const MenuPage = () => {
  const [alignValue, setAlignValue] = React.useState('start');
  return (
    <>

      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicator={{
          size: (origin) => origin - 30,
          align: alignValue,
        }}
      />

    </>
  );
};
export default MenuPage;