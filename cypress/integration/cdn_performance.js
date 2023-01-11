describe('Display cdn compression data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/responsetime?start_date=2022-06-22&end_date=2022-06-25&subdomain=api.test.com', {
      fixture: 'cdn/response_time.json'
    }).as('response_time')

    cy.intercept('/test.com/v1/shared_cdn/cdn/bytes?start_date=2022-06-22&end_date=2022-06-25&subdomain=api.test.com', {
      fixture: 'cdn/bytes.json'
    }).as('bytes')

    cy.visit('/test.com/owstats#/cdn_performance?start_date=2022-06-22&end_date=2022-06-25&domain=api.test.com&dataSource=cdn')
    cy.wait('@domains')
    cy.wait('@cdn_domains')
    cy.wait('@response_time')
  })

  it('displays cdn data', () => {
  })
})
