describe('Display robot data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/robots/validhits?start_date=2018-01-01&end_date=2021-01-01', {
      fixture: 'webhosting/robots_validhits_20180101_20210101.json'
    }).as('robots_validhits')

    cy.intercept('/test.com/v1/robots_pages/hits?start_date=2018-01-01&end_date=2021-01-01', {
      fixture: 'webhosting/robots_pages_hits_20180101_20210101.json'
    }).as('robots_pages_hits')

    cy.visit('/test.com/owstats#/robot?start_date=2018-01-01&end_date=2021-01-01')
    cy.wait('@domains')
    cy.wait('@robots_validhits')
    cy.wait('@robots_pages_hits')
  })

  it('displays top-robot component with correct values', () => {
    // check chart legends contains correct values
    cy.get('#top-robot').find('.apexcharts-legend-text').should('have.length', 1)
    cy.get('#top-robot').find('.apexcharts-legend-text').contains('Go-http-client/1.1').should('exist')

    // check table contains correct values
    cy.get('#top-robot').find('tr').should('have.length', 2)

    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('511')
    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('100.0')
  })

  it('displays top-robot-detailed component with correct values', () => {
    // check table contains correct values
    cy.get('#top-robot-detailed').find('tr').should('have.length', 3)

    cy.get('#top-robot-detailed').find('tr').filter(':contains("Go-http-client/1.1")').contains('511')
    cy.get('#top-robot-detailed').find('tr').filter(':contains("Go-http-client/1.1")').contains('50.0')
    cy.get('#top-robot-detailed').find('tr').filter(':contains("Go-http-client/2.0")').contains('511')
    cy.get('#top-robot-detailed').find('tr').filter(':contains("Go-http-client/2.0")').contains('50.0')
  })
})
