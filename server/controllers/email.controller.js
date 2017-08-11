import Email from '../models/email';

export function getCompilationEmails(req, res) {
  Email.find({ _compilation: req.params.id })
  .then((emails) => {
    res.json(emails);
  });
}

export function rotateImageAttachment(req) {
  console.log('blah hey working', req.params.compilationId, req.params.emailId, req.params.attachmentId);
}
