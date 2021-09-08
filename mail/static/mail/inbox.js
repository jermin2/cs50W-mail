document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // When you click send, send an email
  document.querySelector('form').onsubmit = () => send_email();
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email() {

  console.log("send something")

  // Get email data
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // send email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      
      //show sent box
      this.load_mailbox('sent')
  });



  return false

}

function load_email(email) {

  // Show the email view and hide the other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      const emailView = document.querySelector('#emails-view')

      const emailTable = document.createElement('table')
      emailTable.classList = "w-100 table table-striped"
      var email;
      for(const i in emails){
        const email = emails[i];
        

        emailTable.appendChild( this.createEmailObject(email) )
      }

      emailView.appendChild(emailTable);

  });
}

function createEmailObject(email) {
  const e = document.createElement('tr');
  e.classList = "email";
  if(email.read===true){
    e.style.background = "lightgray"
  }
  else {
    e.style.background = "white"
  }
  
  // Sender
  const sender = document.createElement('td');
  sender.innerHTML = `<h5>${email.sender}</h5>`;
  e.appendChild(sender)

  // Subject
  const subject = document.createElement('td');
  subject.innerHTML = `<h5>${email.subject}</h5>`;
  e.appendChild(subject);

  // timestamp
  const timestamp = document.createElement('td');
  timestamp.innerHTML = email.timestamp;
  e.appendChild(timestamp);

  return e;
}