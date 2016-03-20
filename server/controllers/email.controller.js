import Email from '../models/email';

export function getCompilationEmails(req, res) {
  Email.find({ _compilation: req.params.id })
  .then((emails) => {
    res.json(emails);
  });
}
