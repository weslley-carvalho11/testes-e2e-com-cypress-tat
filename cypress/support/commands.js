
// const attachFileHandler = (attachFile) => {
//   cy.get('#file').selectFile('cypress/fixtures/example.json')
// }

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false })
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
    cy.wait('@getNotes', { timeout: 10000 })
  })
})

Cypress.Commands.add('guiLogin', (
  userEmail = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email').type(userEmail)
  cy.get('#password').type(password, { log: false })
  cy.contains('button[type="submit"]', 'Login').click()
  cy.wait('@getNotes', { timeout: 10000 })
  cy.contains('h1', 'Your Notes').should('be.visible')
})

Cypress.Commands.add('sessionLogin', (
  userEmail = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLogin(userEmail, password)
  cy.session(userEmail, login)
})

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)
  cy.contains(note).should('be.visible')

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Create').click()
  cy.wait('@getNotes')

  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, editNote, attachFile = false) => {
  cy.contains('.list-group-item', note).should('be.visible').click()
  cy.get('#content').clear()
  cy.get('#content').type(editNote)

  if (attachFile) {
    attachFileHandler()
  }

  cy.contains('button', 'Save').click()
  cy.contains('.list-group-item', note).should('not.exist')
  cy.contains('.list-group-item', editNote).should('be.visible')
})

Cypress.Commands.add('deleteNote', (editNote) => {
  cy.contains('.list-group-item', editNote).should('be.visible').click()
  cy.contains('button', 'Delete').click()
  cy.wait('@getNotes')

  cy.get('.list-group-item').its('length').should('be.at.least', 1)
  cy.contains('.list-group-item', editNote).should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})

