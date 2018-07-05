export default {
  path: '/courses',
  component: require('@/views/courseQuery/'),
  children: [{
    path: '',
    component(resolve) {
      require(['@/views/courseQuery/courseList'],resolve)
    }
  },{
    path: 'class',
    component(resolve) {
      require(['@/views/courseQuery/classQuery'], resolve)
    }
  }, {
    path: 'teacher',
    component(resolve) {
      require(['@/views/courseQuery/teacherQuery'], resolve)
    }
  }]
}