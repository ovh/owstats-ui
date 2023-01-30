describe('Display geolocalization data: no data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/geolocalization/visits?start_date=2019-07-10&end_date=2019-07-20', {
      fixture: 'webhosting/no_data.json'
    }).as('geolocalization_visits_20190710_20190720')

    cy.visit('/test.com/owstats#/geolocalization?start_date=2019-07-10&end_date=2019-07-20&domain=all')

    cy.wait('@domains')
    cy.wait('@geolocalization_visits_20190710_20190720')
  })

  it('displays geolocalization page when there is no data', () => {
    const noDataRegex = /^(Pas de données|No data)$/
    cy.get('#data_source_world_map').should('exist')
    cy.get('.geoloc-visits').find('tr').contains(noDataRegex).should('exist')
    cy.get('#top-region').find('tr').contains(noDataRegex).should('exist')
  })
})
