// 数据源
const userData = [
  {
    month: '00:00',
    city: '21-02-02',
    temperature: 7,
  },
  {
    month: '00:00',
    city: '21-02-01',
    temperature: 39,
  },
  {
    month: '01:00',
    city: '21-02-02',
    temperature: 6,
  },
  {
    month: '01:00',
    city: '21-02-01',
    temperature: 4,
  },
  {
    month: '02:00',
    city: '21-02-02',
    temperature: 9,
  },
  {
    month: '02:00',
    city: '21-02-01',
    temperature: 5,
  },
  {
    month: '03:00',
    city: '21-02-02',
    temperature: 14,
  },
  {
    month: '03:00',
    city: '21-02-01',
    temperature: 8,
  },
  {
    month: '04:00',
    city: '21-02-02',
    temperature: 18,
  },
  {
    month: '04:00',
    city: '21-02-01',
    temperature: 11,
  },
  {
    month: '05:00',
    city: '21-02-02',
    temperature: 21,
  },
  {
    month: '05:00',
    city: '21-02-01',
    temperature: 15,
  },
  {
    month: '06:00',
    city: '21-02-02',
    temperature: 25,
  },
  {
    month: '06:00',
    city: '21-02-01',
    temperature: 17,
  },
  {
    month: '07:00',
    city: '21-02-02',
    temperature: 26,
  },
  {
    month: '07:00',
    city: '21-02-01',
    temperature: 16,
  },
  {
    month: '08:00',
    city: '21-02-02',
    temperature: 23,
  },
  {
    month: '08:00',
    city: '21-02-01',
    temperature: 14,
  },
  {
    month: '09:00',
    city: '21-02-02',
    temperature: 18,
  },
  {
    month: '09:00',
    city: '21-02-01',
    temperature: 10,
  },
  {
    month: '10:00',
    city: '21-02-02',
    temperature: 13,
  },
  {
    month: '10:00',
    city: '21-02-01',
    temperature: 6,
  },
  {
    month: '11:00',
    city: '21-02-02',
    temperature: 9,
  },
  {
    month: '11:00',
    city: '21-02-01',
    temperature: 4,
  },
];

const saleData = [
  {
    month: '00:00',
    city: '21-02-02',
    temperature: 427,
  },
  {
    month: '00:00',
    city: '21-02-01',
    temperature: 339,
  },
  {
    month: '01:00',
    city: '21-02-02',
    temperature: 216,
  },
  {
    month: '01:00',
    city: '21-02-01',
    temperature: 432,
  },
  {
    month: '02:00',
    city: '21-02-02',
    temperature: 129,
  },
  {
    month: '02:00',
    city: '21-02-01',
    temperature: 145,
  },
  {
    month: '03:00',
    city: '21-02-02',
    temperature: 144,
  },
  {
    month: '03:00',
    city: '21-02-01',
    temperature: 98,
  },
  {
    month: '04:00',
    city: '21-02-02',
    temperature: 198,
  },
  {
    month: '04:00',
    city: '21-02-01',
    temperature: 191,
  },
  {
    month: '05:00',
    city: '21-02-02',
    temperature: 291,
  },
  {
    month: '05:00',
    city: '21-02-01',
    temperature: 195,
  },
  {
    month: '06:00',
    city: '21-02-02',
    temperature: 255,
  },
  {
    month: '06:00',
    city: '21-02-01',
    temperature: 167,
  },
  {
    month: '07:00',
    city: '21-02-02',
    temperature: 246,
  },
  {
    month: '07:00',
    city: '21-02-01',
    temperature: 126,
  },
  {
    month: '08:00',
    city: '21-02-02',
    temperature: 233,
  },
  {
    month: '08:00',
    city: '21-02-01',
    temperature: 124,
  },
  {
    month: '09:00',
    city: '21-02-02',
    temperature: 18,
  },
  {
    month: '09:00',
    city: '21-02-01',
    temperature: 130,
  },
  {
    month: '10:00',
    city: '21-02-02',
    temperature: 133,
  },
  {
    month: '10:00',
    city: '21-02-01',
    temperature: 6,
  },
  {
    month: '11:00',
    city: '21-02-02',
    temperature: 91,
  },
  {
    month: '11:00',
    city: '21-02-01',
    temperature: 41,
  },
];

const hotProductsList = [
  {
    title: '2020 New Woodworking Edge Corner Plane【Christmas Sale-70%OFF】',
    qty: '98',
  },
  {
    title:
      'Portable Ultrasonic Washing Machines（Suitable For Bowls, Clothes, Glasses, Fruits, Vegetables And Tea Sets）',
    qty: '85',
  },
  {
    title: 'Multifunctional stainless steel basin-Buy 2 free shipping&get 10% off',
    qty: '76',
  },
  {
    title: 'Hot Selling!!!Premium Windshield Snow Cover Sunshade',
    qty: '34',
  },
  {
    title: 'Car Oil Fuel Filter for 4003 WIX - 1/2-28 5/8-24',
    qty: '30',
  },
  {
    title: ' Edge Corner Plane【Christmas Sale-70%OFF】',
    qty: '19',
  },
  {
    title: 'Hot Sale! Silicone Egg Box (Set of 4 PCS)',
    qty: '9',
  },
];

const orderata = [
  { year: '20-12-23', value: 38 },
  { year: '20-12-24', value: 52 },
  { year: '20-12-25', value: 61 },
  { year: '20-12-26', value: 45 },
  { year: '20-12-27', value: 48 },
  { year: '20-12-28', value: 38 },
  { year: '20-12-29', value: 38 },
  { year: '20-12-80', value: 38 },
];

export default {
  'GET /mock/user': (req, res) => {
    setTimeout(() => {
      res.json({
        data: userData,
      });
    }, 500);
  },
  'GET /mock/sale': (req, res) => {
    setTimeout(() => {
      res.json({
        data: saleData,
      });
    }, 500);
  },
  'GET /mock/hotProduct': (req, res) => {
    setTimeout(() => {
      res.json({
        data: hotProductsList,
      });
    }, 500);
  },
  'GET /mock/order': (req, res) => {
    setTimeout(() => {
      res.json({
        data: orderata,
      });
    }, 500);
  },
};
