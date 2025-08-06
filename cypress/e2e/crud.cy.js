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
    let attachFile = false

    it('Fazer CRUD de notas', () => {
        cy.createNote(note)
        cy.wait('@getNote')
        cy.editNote(note, editNote, attachFile)
        cy.wait('@getNote')
        cy.deleteNote(editNote)
        cy.wait('@getNote')
    })
})