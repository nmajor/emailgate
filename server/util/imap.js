import Imap from 'imap';
// import { MailParser } from 'mailparser';
// import Stream from 'stream';

export function initImap(config) {
  const imap = new Imap({
    user: config.email,
    password: config.password,
    host: config.host,
    port: config.port,
    tls: {
      secureProtocol: 'TLSv1_method',
    },
    // debug: console.log
  });

  return imap;
}

// export function emailStream(compilation) {
//   const emailStream = Stream.PassThrough();
//
//   const boxName = compilation.imap.filter.mailbox;
//   const filterArray = compilation.imap.filter.array;
//
//   const imap = initImap(compilation.imap.credentials);
//
//   imap.connect();
//
//   imap.on('error', function(err) {
//     if ( err.toString() !== "Error: read ECONNRESET" ) { console.log("ERROR: " + err); }
//   });
//
//   imap.once('end', function() {
//     console.log('Connection ended');
//   });
//
//   imap.once('ready', function() {
//     imap.openBox(boxName, true, function(err, box) {
//       if (err) { console.log(err); return; }
//
//       imap.seq.search(filterArray, function(err, results) {
//         if (err) { console.log(err); return; }
//         if (results.length < 1) {
//           imap.end();
//           emailStream.end();
//           return;
//         }
//
//         var f = imap.seq.fetch(results, { bodies: ''});
//         f.on('message', function(msg, seqno) {
//
//           msg.on('body', function(msgStream, info) {
//             var mailparser = new MailParser();
//             mailparser.on('end', function(msgObj) {
//               msgObj.seqno = seqno;
//               emailStream.write(new Buffer( JSON.stringify(msgObj) ) );
//             });
//
//             msgStream.pipe(mailparser);
//           });
//         });
//
//         f.on('error', function(err) {
//           if (err) { console.log(err); return; }
//         });
//         f.on('end', function() {
//           imap.closeBox(function() {
//             imap.end();
//             emailStream.end();
//           });
//         });
//
//       });
//     });
//   });
//
//   return emailStream;
// }
