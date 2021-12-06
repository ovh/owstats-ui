describe('Display requests data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/request_origfilepath/validhits?start_date=2018-12-12&end_date=2019-03-01', {
      fixture: 'request_origfilepath_validhits_20181212_20190301.json'
    }).as('request_origfilepath_validhits')

    cy.intercept('/test.com/v1/request_origfilepath/validhits?start_date=2018-12-12&end_date=2019-03-01&subdomain=www.test.com', {
      fixture: 'request_origfilepath_validhits_20181212_20190301_test.json'
    }).as('request_origfilepath_validhits_test')

    cy.intercept('/test.com/v1/request_form/validhits?start_date=2018-12-12&end_date=2019-03-01', {
      fixture: 'request_form_validhits_20181212_20190301.json'
    }).as('request_form_validhits')

    cy.intercept('/test.com/v1/request_form/validhits?start_date=2018-12-12&end_date=2019-03-01&subdomain=www.test.com', {
      fixture: 'request_form_validhits_20181212_20190301_test.json'
    }).as('request_form_validhits_test')

    cy.intercept('/test.com/v1/initial_path/visits?start_date=2018-12-12&end_date=2019-03-01', {
      fixture: 'initial_path_visits_20181212_20190301.json'
    }).as('initial_path_visits')

    cy.intercept('/test.com/v1/initial_path/visits?start_date=2018-12-12&end_date=2019-03-01&subdomain=www.test.com', {
      fixture: 'initial_path_visits_20181212_20190301_test.json'
    }).as('initial_path_visits_test')

    cy.visit('/test.com/owstats#/request?start_date=2018-12-12&end_date=2019-03-01&domain=www.test.com')
    cy.wait('@domains')
    cy.wait('@request_origfilepath_validhits_test')
    cy.wait('@request_form_validhits_test')
    cy.wait('@initial_path_visits_test')
  })

  it('displays top-path component with correct values', () => {
    // check chart legends contains correct values
    cy.get('#top-paths').find('.apexcharts-legend-text').should('have.length', 4)
    cy.get('#top-paths').find('.apexcharts-legend-text').contains('/assets/built/screen.css').should('exist')
    cy.get('#top-paths').find('.apexcharts-legend-text').contains('/assets/built/jquery.fitvids.js').should('exist')
    cy.get('#top-paths').find('.apexcharts-legend-text').contains('/assets/built/infinitescroll.js').should('exist')

    // check table contains correct values
    cy.get('#top-paths').find('tr').should('have.length', 11)

    cy.get('#top-paths').find('tr').filter(':contains("/assets/built/screen.css")').contains('5280')
    cy.get('#top-paths').find('tr').filter(':contains("/assets/built/screen.css")').contains('26.5')

    cy.get('#top-paths').find('tr').filter(':contains("/assets/built/jquery.fitvids.js")').contains('4720')
    cy.get('#top-paths').find('tr').filter(':contains("/assets/built/jquery.fitvids.js")').contains('23.7')
  })

  it('displays top-path component with correct values', () => {
    const noDataRegex = /^(Pas de données|No data)$/

    // check table contains correct values
    cy.get('#top-form').find('tr').contains(noDataRegex).should('exist')
  })

  it('displays top-initial component with correct values', () => {
    // check table contains correct values
    cy.get('#top-initial').find('tr').should('have.length', 11)
  })

  it('displays request page correctly removing filter on subdomain', () => {
    cy.get('.domain-selection').click()
    cy.get('.dropdown-item').contains(/^(.*Tous.*|.*All.*)$/).click()

    // check table contains correct values
    cy.get('#top-initial').find('tr').should('have.length', 11)
  })
})
