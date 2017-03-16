FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('Home')
  }
})

FlowRouter.route('/signup', {
  name: 'Signup',
  action() {
    BlazeLayout.render('Signup')
  }
})

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    BlazeLayout.render('Login')
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
