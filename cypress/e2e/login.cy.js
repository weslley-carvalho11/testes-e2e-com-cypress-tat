/// <reference types="cypress"/>
describe('Suite de Testes', () => {
    it('Fazer o login', () => {

    cy.guiLogin()

    cy.contains('h1', 'Your Notes').should('be.visible')
    cy.contains('h4', ' Create a new note').should('be.visible')
    })
})
