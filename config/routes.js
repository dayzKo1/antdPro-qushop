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
                icon: 'HomeOutlined',
                component: './Home',
              },
              {
                path: '/order',
                name: 'Order',
                icon: 'CopyOutlined',
                component: './Order',
                authority: ['admin'],
              },
              {
                path: '/order/detail/:id',
                name: 'orderDetail',
                component: './Order/Detail',
                hideInMenu: true,
                authority: ['admin'],
              },
              {
                path: '/products',
                name: 'Products',
                icon: 'DatabaseOutlined',
                // component: './Products/ProductsList',
                authority: ['admin'],
                routes: [
                  {
                    path: '/products/productsList',
                    name: 'ProductsList',
                    icon: 'smile',
                    component: './Products/ProductsList',
                    authority: ['admin'],
                  },
                  {
                    path: '/products/categoryList',
                    name: 'CategoryList',
                    icon: 'smile',
                    component: './Products/CategoryList',
                    authority: ['admin'],
                  },
                  {
                    path: '/products/detail/:id',
                    name: 'productDetail',
                    component: './Products/ProductsList/Detail',
                    hideInMenu: true,
                    authority: ['admin'],
                  },
                  {
                    path: '/products/add',
                    name: 'productDetail',
                    component: './Products/ProductsList/Detail',
                    hideInMenu: true,
                    authority: ['admin'],
                  },
                  {
                    path: '/products/categoryList/add',
                    name: 'addCategory',
                    component: './Products/EditCategory',
                    hideInMenu: true,
                    access: 'manage_products',
                  },
                  {
                    path: '/products/categoryList/:id/edit',
                    name: 'editCategory',
                    component: './Products/EditCategory',
                    hideInMenu: true,
                    access: 'manage_products',
                  },
                ],
              },
              {
                path: '/customers',
                name: 'Customers',
                icon: 'TeamOutlined',
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
                icon: 'SettingOutlined',
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
