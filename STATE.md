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
  selectedAccountId: 1,
  accounts: [
    {
      id: 1,
      email: 'blah@blah.com',
      passwordHash: 'jf230fj02mjf9302mjf0932mjf0m32j0f239mf',
      host: 'imap.google.com',
      port: 933,
    }
  ],
  filterForSelectedAccount: {
    mailbox: 'Gmail/[ALL]',
    to: '',
    from: '',
    subject: '',
    startDate: Date.now(),
    endDate: Date.now(),
  },
  filteredAccountEmailsCount: 50,
  filteredAccountEmails: [
    {
      seqno: 424,
      date: Date.now(),
      to: 'blah@blah.com',
      from: 'blah@blah.com',
      subject: 'blah blah subject',
      text: 'blah blah text',
      attachments: [{}],
    },
    {
      seqno: 425,
      date: Date.now(),
      to: 'blah@blah.com',
      from: 'blah@blah.com',
      subject: 'blah blah subject',
      text: 'blah blah text',
      attachments: [{}],
    },
  ],
  selectedCompilation: 5
  compilations: [
    {
      id: 5
      name: 'Compilation Name'
      emails: [
        {
          seqno: 424,
          date: Date.now(),
          to: 'blah@blah.com',
          from: 'blah@blah.com',
          subject: 'blah blah subject',
          text: 'blah blah text',
          attachments: [{}],
        },
      ],
      bookOptions: {
        title: 'book title',
        subtitle: book subtitle,
        message: 'This is the custom message',
        header: {
          date: Boolean,
          subject: Boolean,
          to: Boolean,
          from: Boolean
        },
      },
    },
  ],
}
