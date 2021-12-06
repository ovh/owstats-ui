describe('Display status data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/status/pages?start_date=2018-07-31&end_date=2018-07-31', {
      fixture: 'status_pages_20180731.json'
    }).as('status_pages_20180731')

    cy.intercept('/test.com/v1/status/pages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'status_pages_20180801.json'
    }).as('status_pages_20180801')

    cy.intercept('/test.com/v1/status_pages/errorhits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'status_pages_errorhits_20180801.json'
    }).as('status_pages_errorhits_20180801')

    cy.intercept('/test.com/v1/hour/hits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'hour_hits_20180801.json'
    }).as('hour_hits_20180801')

    cy.intercept('/test.com/v1/hour/errorpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'hour_errorpages_20180801.json'
    }).as('hour_errorpages_20180801')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'hour_pages_20180801.json'
    }).as('hour_pages_20180801')

    cy.intercept('/test.com/v1/hour/errorhits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'hour_errorhits_20180801.json'
    }).as('hour_errorhits_20180801')

    cy.visit('/test.com/owstats#/status?start_date=2018-08-01&end_date=2018-08-01')
    cy.wait('@domains')
    cy.wait('@status_pages_20180731')
    cy.wait('@status_pages_20180801')
    cy.wait('@status_pages_errorhits_20180801')
    cy.wait('@hour_hits_20180801')
    cy.wait('@hour_errorpages_20180801')
    cy.wait('@hour_pages_20180801')
    cy.wait('@hour_errorhits_20180801')
  })

  it('displays trend components with correct values', () => {
    cy.get('#trend200').contains('120 (+16.7 %)').should('exist')
    cy.get('#trend400').contains('5 (-100.0 %)').should('exist')
    cy.get('#trend500').contains('12 (-16.7 %)').should('exist')
  })

  it('displays error-hits component with correct values', () => {
    // simulate hovering on spline chart
    cy.get('#error-hits').click(600, 100)
    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-title')
      .filter(':contains("01/08/2018 21h"), :contains("08/01/2018 21h")')
      .should('exist')

    // verifying tooltip values
    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Nombre d\'accès:"), :contains("Valid Hits")')
      .find('.apexcharts-tooltip-text-y-value').should('have.text', '264')

    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Nombre d\'accès en erreur"), :contains("Error hits count")')
      .find('.apexcharts-tooltip-text-y-value').should('have.text', '3')

    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Pages en erreur"), :contains("Error pages")')
      .find('.apexcharts-tooltip-text-y-value').should('have.text', '3')
  })

  it('displays top-error component with correct values', () => {
    // simulate hovering on spline chart
    cy.get('#top-error').find('tr').should('have.length', 16)
    cy.get('#top-error').find('tr').filter(':contains("/filemanager/dialog.php")').contains('301')
    cy.get('#top-error').find('tr').filter(':contains("/filemanager/dialog.php")').contains('2')
    cy.get('#top-error').find('tr').filter(':contains("/filemanager/dialog.php")').contains('8.3')
  })

  it('displays error-pie component with correct values', () => {
    // check chart legends contains correct values
    cy.get('#error-pie').find('.apexcharts-legend-text').should('have.length', 4)
    cy.get('#error-pie').find('.apexcharts-legend-text').contains('200').should('exist')
    cy.get('#error-pie').find('.apexcharts-legend-text').contains('300').should('exist')
    cy.get('#error-pie').find('.apexcharts-legend-text').contains('400').should('exist')
    cy.get('#error-pie').find('.apexcharts-legend-text').contains('500').should('exist')
  })
})
