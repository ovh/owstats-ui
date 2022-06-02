describe('Display geolocalization data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/geolocalization/visits?start_date=2019-07-10&end_date=2019-07-20&subdomain=shop.test.com', {
      fixture: 'geolocalization_visits_20190710_20190720.json'
    }).as('geolocalization_visits')

    cy.intercept('/test.com/v1/shared_cdn/geolocalization/visits?start_date=2019-07-10&end_date=2019-07-20&subdomain=api.test.com', {
      fixture: 'cdn/geolocalization_visits_20190710_20190720.json'
    }).as('cdn_geolocalization_visits')

    cy.visit('/test.com/owstats#/geolocalization?start_date=2019-07-10&end_date=2019-07-20&domain=shop.test.com')

    cy.wait('@domains')
    cy.wait('@geolocalization_visits')
  })

  it('displays cdn data', () => {
    cy.get('#data_source_world_map').should('exist')
    cy.get('.geoloc-visits').find('tr').should('have.length', 4)
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States of America")').contains('40')
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States of America")').contains('87.0')

    cy.get('#data-source-cdn').click()
    cy.wait('@cdn_domains')
    cy.wait('@cdn_geolocalization_visits')

    cy.get('.geoloc-visits').find('tr').should('have.length', 4)
    cy.get('.geoloc-visits').find('tr').filter(':contains("États-Unis"), :contains("United States of America")').contains('328')
  })
})
