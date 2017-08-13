import Email from '../models/email';

export function getCompilationEmails(req, res) {
  Email.find({ _compilation: req.params.id })
  .then((emails) => {
    res.json(emails);
  });
}

export function rotateImageAttachment(req, res) {
  Email.findOne({ _compilation: req.params.compilationId, _id: req.params.emailId })
  .then((email) => {
    return email.rotateImageAttachment(req.body.attachmentContentId, req.body.angle || 90);
  })
  .then((email) => {
    res.json(email);
  })
  .catch((err) => { console.log('An error happened when rotating an image attachment', err); });
}
