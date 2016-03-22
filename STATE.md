{
  isFetchingAccounts: true,
  isFetchingUser: true,
  isFetchingFilteredAccountEmails: true,
  isFetchingCompilations: true,
  user {
    id: 1,
    email: 'blah@blah.com',
    name: 'Jon Doe',
    loggedIn: true,
    errors: {}
  }
  currentAccountId: 1,
  accounts: [],
  filterForCurrentAccount: {
    mailbox: 'Gmail/[ALL]',
    to: '',
    from: '',
    subject: '',
    startDate: Date.now(),
    endDate: Date.now(),
  },
  filteredAccountEmailsCount: 50,
  filteredAccountEmails: [],
  compilations: [],
}
