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
                name: 'Home',
                icon: 'smile',
                component: './Home',
              },
              {
                path: '/order',
                name: 'Order',
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
                name: 'Products',
                icon: 'crown',
                component: './Products/productsList',
                authority: ['admin'],
                routes: [
                  {
                    path: '/products/productsList',
                    name: 'ProductsList',
                    icon: 'smile',
                    component: './Products/productsList',
                    authority: ['admin'],
                  },
                  {
                    path: '/products/categoryList',
                    name: 'CategoryList',
                    icon: 'smile',
                    component: './Products/categoryList',
                    authority: ['admin'],
                  },
                ],
              },
              {
                path: '/customers',
                name: 'Customers',
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
              {
                path: '/set',
                name: 'Set',
                icon: 'crown',
                component: './Set',
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
