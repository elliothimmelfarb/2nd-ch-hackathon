'use strict';

require('dotenv').load();

let Mail = {
  startLaundry(userObj, cb){

    let helper      = require('sendgrid').mail;
    let from_email  = new helper.Email("squeaker@codinghouse.com");
    let to_email    = new helper.Email(`${userObj.email}`);
    let subject     = "Start Your Laundry!";
    let content     = new helper.Content("text/html",
    `<html>
    <h4>Hi,</h4>
    <p>
    It's your turn to do laundry.
    </p>
    <h4>Have fun!
    <i>-Squeaker</i></h4>
    <p>//squeak squeak</p>
    <br>
    <br>
    <small>  <a href="http://localhost:3000/api/emails/unsubscribe/${userObj._id}">unsubscribe</a> </small>
    </html>`);
    let mail        = new helper.Mail(from_email, subject, to_email, content);
    var sg          = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
    var requestBody = mail.toJSON()
    var request     = sg.emptyRequest()
    request.method  = 'POST'
    request.path    = '/v3/mail/send'
    request.body    = requestBody

    sg.API(request, cb);
  },
  finishLaundry(email, cb){
    let helper      = require('sendgrid').mail;
    let from_email  = new helper.Email("squeaker@codinghouse.com");
    let to_email    = new helper.Email(`${email}`);
    let subject     = "Laundry Time Expired.";
    let content     = new helper.Content("text/html", `<html>
    <h1>Hi,</h1>
    <p>
    Your laundry time has expired. <br>
    I'll email you again when it's your turn in a few days.
    </p>
    <h4>
    <i>-Squeaker</i></h4>
    br
    <p>//squeak squeak</p>
    <br>
    <br>
    <small>  <a href="http://localhost:3000/api/emails/unsubscribe/${userObj._id}">unsubscribe</a> </small>
    </html>`);
    let mail        = new helper.Mail(from_email, subject, to_email, content);
    var sg          = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
    var requestBody = mail.toJSON()
    var request     = sg.emptyRequest()
    request.method  = 'POST'
    request.path    = '/v3/mail/send'
    request.body    = requestBody

    sg.API(request, cb);
  }
};

module.exports = Mail;
