export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/home',
              },
              {
                path: '/home',
                name: '主页',
                icon: 'smile',
                component: './Home',
              },
              {
                path: '/order',
                name: '订单',
                icon: 'crown',
                component: './Order',
                authority: ['admin'],
                routes: [
                  // {
                  //   path: '/order/add',
                  //   name: 'sub-page',
                  //   icon: 'smile',
                  //   component: './Order/add',
                  //   authority: ['admin'],
                  // },
                ],
              },
              {
                path: '/products',
                name: '商品',
                icon: 'crown',
                component: './Products/productsList',
                authority: ['admin'],
                routes: [
                  {
                    path: '/products/productsList',
                    name: '商品列表',
                    icon: 'smile',
                    component: './Products/productsList',
                    authority: ['admin'],
                  },
                  {
                    path: '/products/categoryList',
                    name: '分类列表',
                    icon: 'smile',
                    component: './Products/categoryList',
                    authority: ['admin'],
                  },
                ],
              },
              {
                path: '/Customers',
                name: '顾客',
                icon: 'crown',
                component: './Customers',
                authority: ['admin'],
                routes: [
                  // {
                  //   path: '/Customers/add',
                  //   name: 'sub-page',
                  //   icon: 'smile',
                  //   component: './Order/add',
                  //   authority: ['admin'],
                  // },
                ],
              },
              // {
              //   path: '/welcome',
              //   name: 'welcome',
              //   icon: 'smile',
              //   component: './Welcome',
              // },
              // {
              //   path: '/admin',
              //   name: 'admin',
              //   icon: 'crown',
              //   component: './Admin',
              //   authority: ['admin'],
              //   routes: [
              //     {
              //       path: '/admin/sub-page',
              //       name: 'sub-page',
              //       icon: 'smile',
              //       component: './Welcome',
              //       authority: ['admin'],
              //     },
              //   ],
              // },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './TableList',
              // },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
