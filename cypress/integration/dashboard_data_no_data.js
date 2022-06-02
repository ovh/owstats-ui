describe('Display Dashboard page: no data', () => {
  it('displays dashboard page: no data', () => {
    // intercept all api calls to get data from fixture
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/no_data.json'
    }).as('hour_visits')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/no_data.json'
    }).as('hour_pages')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/no_data.json'
    }).as('hour_avgsessiontime')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/no_data.json'
    }).as('domains_validpages')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/no_data.json'
    }).as('domains_errorpages')

    cy.visit('/test.com/owstats#/dashboard?start_date=2018-08-01&end_date=2018-08-01&domain=all')

    cy.wait('@domains')
    cy.wait('@hour_visits')
    cy.wait('@hour_pages')
    cy.wait('@hour_avgsessiontime')
    cy.wait('@domains_validpages')
    cy.wait('@domains_errorpages')

    // domain info is not present
    cy.get('[data-cy="top-domain-card"]').should('not.exist')

    // traffic is present and values are correct

    // simulate hovering on spline chart
    cy.get('#traffic').click(600, 100)
    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-title')
      .filter(':contains("01/08/2018 21h"), :contains("08/01/2018 21h")')
      .should('exist')

    // domain info is present and values are correct
    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages vues et en erreur"), :contains("View and error pages")')
      .find('.widget-numbers')
      .filter(':contains("0")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.widget-numbers')
      .filter(':contains("0")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Average session duration"), :contains("Temps moyen d\'une session")')
      .find('.widget-numbers')
      .filter(':contains("0sec")')
  })
})
