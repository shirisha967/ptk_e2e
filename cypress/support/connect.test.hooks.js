before("Test prerequisites", function () {
    /* This file holds code that will check for the existence of the e2e test property
       and provider used in the Connect tests.  It also contains the before and after hooks
       that run before and after the suite of tests.
    */

    /* In order for Marketing and Portal tests to work we should not visit PTK Connect because
       this will cause an error due to cross-origin issues in Cypress.
    */
    const specRelativePath = Cypress.spec.relative;

    if (specRelativePath.includes("connect")) {
        cy.log("Spec: " + Cypress.spec.name);
        cy.loginToAdmin()
            .ensureTestProperty()
            .as("testPropertyId")
            .then(() => {
                Cypress.env("testPropertyId", this.testPropertyId);
            })
            .ensureDefaultValuesForTestProperty()
            .ensureThereIsAProvider()
            .logoutFromAdmin();
    }
});
