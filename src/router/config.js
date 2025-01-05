import _ from "lodash";

const options = {
  routes: [
    {
      path: "/",
      name: "Browser",
			component: () => import('@/views/Browser.vue')
    },
  ],
};

options.initRoutes = _.cloneDeep(options.routes);
export default options;
