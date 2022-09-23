/// <reference types="cypress" />



describe('Header Announcements', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5000/login/')

        cy.get('input[id=login-user]').should('be.visible').type('admin')
        cy.get('input[id=login-password]').should('be.visible').type('admin{enter}')
    })

    it('should be below navbar', () => {
        cy.get('.navbar').next().should('have.id', 'header_announcement')
    })

    it('should be hidden when no announcement is set', () => {
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
    })

    it('should have a visible message', () => {
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
        cy.get('#header_announcement').should('be.visible').should('contain.html', 'this is a test')
    })

    it('should contain a link', () => {
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
    })

    it('should not allow script', () => {
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
