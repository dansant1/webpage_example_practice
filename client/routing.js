FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('Home', { contenido: 'inicio'})
  }
})

FlowRouter.route('/faq', {
  name: 'faq',
  action() {
    BlazeLayout.render('Home', { contenido: 'faq'})
  }
})

FlowRouter.route('/rateus', {
  name: 'RateUs',
  action() {
    BlazeLayout.render('Home', { contenido: 'rate'})
  }
})

FlowRouter.route('/support', {
  name: 'support',
  action() {
    BlazeLayout.render('Home', { contenido: 'support'})
  }
})

FlowRouter.route('/terms', {
  name: 'Terms',
  action() {
    BlazeLayout.render('Home', { contenido: 'terms'})
  }
})

FlowRouter.route('/signup', {
  name: 'Signup',
  action(params, queryParams) {
    BlazeLayout.render('Home', { contenido: 'Signup'})
  }
})

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    BlazeLayout.render('Home', { contenido: 'Login'})
  }
})


FlowRouter.route('/admin', {
  name: 'Admin.Inicio',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminInicio' })
  }
})

FlowRouter.route('/admin/deposit', {
  name: 'Admin.makeDeposit',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminMakeDeposit' })
  }
})

FlowRouter.route('/admin/deposit/list', {
  name: 'Admin.DepositList',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminDepositList' })
  }
})

FlowRouter.route('/admin/withdraw', {
  name: 'Admin.makeWithdraw',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminWithDraw' })
  }
})

FlowRouter.route('/admin/withdraw/list', {
  name: 'Admin.WithdrawList',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminWithDrawList' })
  }
})

FlowRouter.route('/admin/referal', {
  name: 'Admin.Referals',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminReferals' })
  }
})

FlowRouter.route('/admin/settings', {
  name: 'Admin.Settings',
  action() {
    BlazeLayout.render('AdminLayout', { pagina: 'AdminSettings' })
  }
})
