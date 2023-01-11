describe('Display browser data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/browser/visits?start_date=2019-06-06&end_date=2019-06-06&subdomain=cdn.test.com', {
      fixture: 'cdn/browser_visits_20190606.json'
    }).as('cdn_browser_visits')

    cy.intercept('/test.com/v1/browser/visits?start_date=2019-06-06&end_date=2019-06-06&subdomain=api.test.com', {
      fixture: 'webhosting/browser_visits_20190606_api.json'
    }).as('browser_visits_api')

    cy.visit('/test.com/owstats#/browser?start_date=2019-06-06&end_date=2019-06-06&domain=api.test.com')
    cy.wait('@domains')
    cy.wait('@browser_visits_api')
  })

  it('displays cdn data', () => {
    // check table contains correct values
    cy.get('#top-browser').find('tr').should('have.length', 3)
    cy.get('#top-browser').find('tr').filter(':contains("Firefox")').contains('4')

    cy.get('#top-platform').find('tr').should('have.length', 4)
    cy.get('#top-platform').find('tr').filter(':contains("Linux")').contains('4')

    cy.get('#top-browser-details').find('tr').should('have.length', 6)
    cy.get('#top-browser-details').find('tr').filter(':contains("Linux"):contains("Chromium"):contains("76")').contains('4')

    // switch  to cdn
    cy.get('.domain-selection').click()
    cy.get('.dropdown-item').contains('cdn.test.com').click()
    cy.wait('@cdn_browser_visits')

    cy.get('#top-browser').find('tr').should('have.length', 4)
    cy.get('#top-browser').find('tr').filter(':contains("Firefox")').contains('80')

    cy.get('#top-platform').find('tr').should('have.length', 4)
    cy.get('#top-platform').find('tr').filter(':contains("Linux")').contains('60')

    cy.get('#top-browser-details').find('tr').should('have.length', 8)
    cy.get('#top-browser-details').find('tr').filter(':contains("Linux"):contains("Chromium"):contains("76")').contains('40')
  })
})
