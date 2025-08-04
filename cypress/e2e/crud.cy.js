/// <reference types="cypress"/>

import { faker } from '@faker-js/faker/locale/en'

describe('Suite de Teste- CRUD de notas', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/notes').as('getNotes')
        cy.intercept('GET', '**/notes/**').as('getNote')
        cy.sessionLogin()
    })

    const note = faker.word.words(5)
    const editNote = faker.word.words(6)

    it('Fazer CRUD de notas', () => {
        cy.visit('/notes/new')

        cy.get('#content').type(note)
        cy.contains(note).should('be.visible')
        cy.contains('button', 'Create').click()
        cy.wait('@getNotes')

        cy.contains('.list-group-item', note).should('be.visible').click()

        cy.wait('@getNote')
        cy.get('#content').clear()
        cy.get('#content').type(editNote)
        cy.contains('button', 'Save').click()
        cy.wait('@getNotes')

        cy.contains('.list-group-item', note).should('not.exist')
        cy.contains('.list-group-item', editNote).should('be.visible').click()

        cy.wait('@getNote')
        cy.contains('button', 'Delete').click()
        cy.wait('@getNotes')

        cy.get('.list-group-item').its('length').should('be.at.least', 1)
        cy.contains('.list-group-item', editNote).should('not.exist')
    })
})