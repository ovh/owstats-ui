describe('Display geolocalization data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/geolocalization/visits?start_date=2019-07-10&end_date=2019-07-20', {
      fixture: 'webhosting/geolocalization_visits_20190710_20190720.json'
    }).as('geolocalization_visits_20190710_20190720')

    cy.intercept('/test.com/v1/geolocalization/visits?start_date=2019-08-10&end_date=2019-08-20', {
      fixture: 'webhosting/geolocalization_visits_20190810_20190820.json'
    }).as('geolocalization_visits_20190810_20190820')

    cy.visit('/test.com/owstats#/geolocalization?start_date=2019-07-10&end_date=2019-07-20&domain=all')

    cy.wait('@domains')
    cy.wait('@geolocalization_visits_20190710_20190720')
  })

  it('displays heat map component with correct values', () => {
    cy.get('#data_source_world_map').should('exist')
    cy.get('.geoloc-visits').find('tr').should('have.length', 4)
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('40')
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('87.0')

    cy.get('.geoloc-visits').find('tr').filter(':contains("France")').contains('4')
    cy.get('.geoloc-visits').find('tr').filter(':contains("France")').contains('8.7')

    cy.get('.geoloc-visits').find('tr').filter(':contains("Allemagne"), :contains("Germany")').contains('2')
    cy.get('.geoloc-visits').find('tr').filter(':contains("Allemagne"), :contains("Germany")').contains('4.3')
  })

  it('displays top region component with correct values', () => {
    cy.get('#top-region').find('tr').should('have.length', 4)
    cy.get('#top-region').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('California')
    cy.get('#top-region').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('40')
    cy.get('#top-region').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('87.0')

    cy.get('#top-region').find('tr').filter(':contains("France")').contains('Occitanie')
    cy.get('#top-region').find('tr').filter(':contains("France")').contains('4')
    cy.get('#top-region').find('tr').filter(':contains("France")').contains('8.7')

    cy.get('#top-region').find('tr').filter(':contains("Allemagne"), :contains("Saxe")').contains('2')
    cy.get('#top-region').find('tr').filter(':contains("Allemagne"), :contains("Germany")').contains('2')
    cy.get('#top-region').find('tr').filter(':contains("Allemagne"), :contains("Germany")').contains('4.3')
  })

  it('displays geolocalization correctly after filtering on date', () => {
    cy.get('#RangeDatePicker-input').click()
    cy.get('.datepicker-next').click()

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    cy.get('.datepicker-day-text').contains('10').click()
    cy.get('.datepicker-day-text').contains('20').click()
    cy.get('.datepicker-button.validate').click()
    cy.wait('@geolocalization_visits_20190810_20190820')

    cy.get('#top-region').find('tr').should('have.length', 2)
    cy.get('#top-region').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('California')

    cy.get('.geoloc-visits').find('tr').should('have.length', 2)
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('44')
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States")').contains('100.0')
  })
})
