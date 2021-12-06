describe('Display browser page: no data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/browser/visits?start_date=2019-06-06&end_date=2019-06-06', {
      fixture: 'no_data.json'
    }).as('browser_visits')

    cy.visit('/test.com/owstats#/browser?start_date=2019-06-06&end_date=2019-06-06&domain=all')
    cy.wait('@domains')
    cy.wait('@browser_visits')
  })

  it('displays browser page when there is no data', () => {
    const noDataRegex = /^(Pas de données|No data)$/
    cy.get('#top-browser').find('.apexcharts-canvas').contains(noDataRegex).should('exist')
    cy.get('#top-browser').find('tr').contains(noDataRegex).should('exist')

    cy.get('#top-platform').find('tr').contains(noDataRegex).should('exist')
    cy.get('#top-platform').find('.apexcharts-canvas').contains(noDataRegex).should('exist')

    cy.get('#top-browser-details').find('tr').contains(noDataRegex).should('exist')
  })
})
