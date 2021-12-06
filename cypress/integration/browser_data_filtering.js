describe('Display browser data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/browser/visits?start_date=2019-06-06&end_date=2019-06-06', {
      fixture: 'browser_visits_20190606.json'
    }).as('browser_visits')

    cy.intercept('/test.com/v1/browser/visits?start_date=2019-06-06&end_date=2019-06-06&subdomain=api.test.com', {
      fixture: 'browser_visits_20190606_api.json'
    }).as('browser_visits_api')

    cy.visit('/test.com/owstats#/browser?start_date=2019-06-06&end_date=2019-06-06&domain=all')
    cy.wait('@domains')
    cy.wait('@browser_visits')
  })

  it('displays top-browser component with correct values', () => {
    // check chart legends contains correct values
    cy.get('#top-browser').find('.apexcharts-legend-text').should('have.length', 3)
    cy.get('#top-browser').find('.apexcharts-legend-text').contains('Firefox').should('exist')
    cy.get('#top-browser').find('.apexcharts-legend-text').contains('Chromium').should('exist')
    cy.get('#top-browser').find('.apexcharts-legend-text').contains('Safari').should('exist')

    // check table contains correct values
    cy.get('#top-browser').find('tr').should('have.length', 4)

    cy.get('#top-browser').find('tr').filter(':contains("Firefox")').contains('8')
    cy.get('#top-browser').find('tr').filter(':contains("Firefox")').contains('57.1')
    cy.get('#top-browser').find('tr').filter(':contains("Chromium")').contains('4')
    cy.get('#top-browser').find('tr').filter(':contains("Chromium")').contains('28.6')
    cy.get('#top-browser').find('tr').filter(':contains("Safari")').contains('2')
    cy.get('#top-browser').find('tr').filter(':contains("Safari")').contains('14.3')
  })

  it('displays top-platform component with correct values', () => {
    // check chart legends contains correct values
    cy.get('#top-platform').find('.apexcharts-legend-text').should('have.length', 4)
    cy.get('#top-platform').find('.apexcharts-legend-text').contains('Linux').should('exist')
    cy.get('#top-platform').find('.apexcharts-legend-text').contains('Ubuntu').should('exist')
    cy.get('#top-platform').find('.apexcharts-legend-text').contains('Mac OS').should('exist')

    // check table contains correct values
    cy.get('#top-platform').find('tr').should('have.length', 4)
    cy.get('#top-platform').find('tr').filter(':contains("Linux")').contains('6')
    cy.get('#top-platform').find('tr').filter(':contains("Linux")').contains('42.9')
    cy.get('#top-platform').find('tr').filter(':contains("Ubuntu")').contains('5')
    cy.get('#top-platform').find('tr').filter(':contains("Ubuntu")').contains('35.7')
    cy.get('#top-platform').find('tr').filter(':contains("Mac OS")').contains('2')
    cy.get('#top-platform').find('tr').filter(':contains("Mac OS")').contains('14.3')
  })

  it('displays top-platform component with correct values', () => {
    // check table contains correct values
    cy.get('#top-browser-details').find('tr').should('have.length', 8)
    cy.get('#top-browser-details').find('tr').filter(':contains("Linux"):contains("Chromium"):contains("76")').contains('4')
    cy.get('#top-browser-details').find('tr').filter(':contains("Linux"):contains("Chromium"):contains("76")').contains('28.6')
    cy.get('#top-browser-details').find('tr').filter(':contains("Ubuntu"):contains("Firefox"):contains("58")').contains('3')
    cy.get('#top-browser-details').find('tr').filter(':contains("Ubuntu"):contains("Firefox"):contains("58")').contains('21.4')
  })

  it('displays browser page correctly after filtering on subdomain', () => {
    // filters on subdomain
    cy.get('.domain-selection').click()
    cy.get('.domain-selection').contains('api.test.com').click()

    // check table contains correct values
    cy.get('#top-browser').find('tr').should('have.length', 3)
    cy.get('#top-browser').find('tr').filter(':contains("Firefox")').contains('4')

    cy.get('#top-platform').find('tr').should('have.length', 4)
    cy.get('#top-platform').find('tr').filter(':contains("Linux")').contains('4')

    cy.get('#top-browser-details').find('tr').should('have.length', 6)
    cy.get('#top-browser-details').find('tr').filter(':contains("Linux"):contains("Chromium"):contains("76")').contains('4')
  })
})
