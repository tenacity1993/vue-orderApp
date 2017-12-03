import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'

Vue.use(Router)
// const indexComponent = { template: '<div>this is root dir</div>' }

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
     // name: 'goods',
     // component: goods
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'
})
