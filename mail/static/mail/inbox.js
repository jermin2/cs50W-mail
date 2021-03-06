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


function reply(email) {
  // Call this to show compose screen
  compose_email(); 

  // Fill in the fields with the detail
  document.querySelector('#compose-recipients').value = email.sender;
  if (email.subject.startsWith('Re: ')){
    document.querySelector('#compose-subject').value = email.subject;
  } else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote: \n ${email.body}`;
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

function archive(email, status) {
  // tell server we have read the email
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: status
    })
  }).then( response => {
    if(response.status===204){
      load_mailbox('inbox');
    }
    else{
    console.log(response);
    }
  })
}

function load_email(email) {

  // When you archive / unarchive
  document.querySelector('#archive').onclick = () => archive(email, true)
  document.querySelector('#unarchive').onclick = () => archive(email, false)

  // Set function for reply button
  document.querySelector('#reply').onclick = () => reply(email)

  // Show archive / unarchive button depending on archive state
  if (email.archived === true) {
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#unarchive').style.display = 'inline-block';
  }
  else {
    document.querySelector('#archive').style.display = 'inline-block';
    document.querySelector('#unarchive').style.display = 'none';
  }

  // Show the email view and hide the other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  const sender = document.querySelector('#email-sender');
  const recipients = document.querySelector('#email-recipients');
  const subject = document.querySelector('#email-subject');
  const timestamp = document.querySelector('#email-timestamp');
  const body = document.querySelector('#email-body');

  sender.innerHTML = email.sender;
  recipients.innerHTML = email.recipients;
  subject.innerHTML = email.subject;
  timestamp.innerHTML = email.timestamp;
  body.value = email.body;

  // tell server we have read the email
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

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
  e.onclick = () => load_email(email)

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