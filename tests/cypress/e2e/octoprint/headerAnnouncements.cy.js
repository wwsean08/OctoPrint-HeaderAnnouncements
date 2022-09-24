/// <reference types="cypress" />

let count = 0

function login() {
    cy.visit('http://localhost:5000/login/')
    cy.get('input[id=login-user]').should('be.visible').clear().type('admin')
    cy.get('input[id=login-password]').should('be.visible').clear().type('admin')
    cy.get('#login-button').click().then(() => {
        //cy.wait() Apply wait if you have to
        //Assert presence of any element from the Dashboard Page
        if (count <= 5 && Cypress.$('.navbar').length === 1) {
            return
        } else if (count <= 5) {
            count++
            login()
        } else if (count > 5) {
            return
        }
    })
}

describe('Header Announcements', () => {
    beforeEach(() => {
        login()
    })

    it('should pass', () => {
        // Verify the header_announcement is below the navbar
        cy.get('.navbar').next().should('have.id', 'header_announcement')

        // If the contents are empty it should not be visible
        cy.request({
            url: '/api/settings',
            method: 'POST',
            body: '{"plugins": {"HeaderAnnouncements": {"announcementText": ""}}}',
            headers: {
                'X-Api-Key': '28E5725F3D57483E81BB27DDD903A086',
                'Content-Type': 'application/json'
            }
        })
        cy.wait(500)
        cy.get('#header_announcement').should('not.be.visible')

        cy.request({
            url: '/api/settings',
            method: 'POST',
            body: '{"plugins": {"HeaderAnnouncements": {"announcementText": "this is a test"}}}',
            headers: {
                'X-Api-Key': '28E5725F3D57483E81BB27DDD903A086',
                'Content-Type': 'application/json'
            }
        })
        cy.wait(500)
        cy.get('#header_announcement').should('be.visible').contains('#header_announcement_msg', 'this is a test')

        // should contain a link
        cy.request({
            url: '/api/settings',
            method: 'POST',
            body: '{"plugins": {"HeaderAnnouncements": {"announcementText": "https://google.com"}}}',
            headers: {
                'X-Api-Key': '28E5725F3D57483E81BB27DDD903A086',
                'Content-Type': 'application/json'
            }
        })
        cy.wait(500)
        cy.get('#header_announcement a').should('have.attr', 'href', 'https://google.com')

        // and should not allow scripts
        cy.request({
            url: '/api/settings',
            method: 'POST',
            body: '{"plugins": {"HeaderAnnouncements": {"announcementText": "<script>alert(\'xss\')</script>"}}}',
            headers: {
                'X-Api-Key': '28E5725F3D57483E81BB27DDD903A086',
                'Content-Type': 'application/json'
            }
        })
        cy.wait(500)
        cy.get('#header_announcement p').should('have.text', '<script>alert(\'xss\')</script>')
    })
})
