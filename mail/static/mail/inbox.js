document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document
    .querySelector('#inbox')
    .addEventListener('click', () => load_mailbox('inbox'));
  document
    .querySelector('#sent')
    .addEventListener('click', () => load_mailbox('sent'));
  document
    .querySelector('#archived')
    .addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document
    .querySelector('#compose-form')
    .addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Get mail
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => render_mail(emails));

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;
}

// open email
function open_email(e) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  const id = e.currentTarget.id;

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => render_email(email));

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true,
    }),
  });
}

// render a single email
function render_email(email) {
  const emailDOM = document.querySelector('#email-view');

  emailDOM.innerHTML = `
  <p><strong>From</strong>: ${email.sender}</p>
  <p><strong>To</strong>: ${email.recipients}</p>
  <p><strong>Subject</strong>: ${email.subject}</p>
  <p><strong>Timestamp</strong>: ${email.timestamp}</p>
  <hr/>
  <p>${email.body}</p>
  `;
}

// render mailbox emails on the page
function render_mail(emails) {
  const emailDOM = document.querySelector('#emails-view');

  for (const email of emails) {
    const row = document.createElement('div');
    row.id = email.id;
    row.classList.add('email-item');
    if (email.read) row.classList.add('email-read');

    row.innerHTML = `
    <span><strong>${email.sender}</strong>: ${email.subject}</span> <span>${email.timestamp}</span>`;

    row.addEventListener('click', open_email);

    emailDOM.appendChild(row);
  }
}

// Send email
function send_email(e) {
  e.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients,
      subject,
      body,
    }),
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('sent');
    });
}
