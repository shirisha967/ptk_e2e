/// <reference types="Cypress" />

describe("Upload image to property photos", () => {
    /* The reason why we are using beforeEach and afterEach is in case
       we need to rerun the tests. This allows us to log out and back in for
       each attempt.
     */

    beforeEach("Log into Connect", () => {
        // Log into Connect
        cy.beforeConnect();
    });

    afterEach("Log out of Connect", () => {
        // Log out of Connect
        cy.log("Log out of Connect");
        cy.logoutOfConnect();
    });

    it("should upload property photo", () => {
        const connectUrl = Cypress.env("connectUrl");

        cy.visit(`${connectUrl}/properties/${Cypress.env("testPropertyId")}/#photos`);

        // make sure there is no photo, if there is then delete it.
        cy.get("body").then(($body) => {
            if ($body.find(".image-slide > h2").length === 0) {
                cy.get("#deleteBtn").click();
            }
        });

        cy.get(".image-slide > h2").should("to.contain", "There Are No Photos Yet!");

        // click a upload a photo
        cy.get(".upload").click();

        // Fill in the form
        cy.waitFor("#uploadModalForm input#name");
        cy.get("#uploadModalForm input#name").click().type("Test Photo");
        cy.get("#uploadModalForm textarea#description").click().type("Test Description");
        cy.get("#uploadModalForm .filter-option").click();
        cy.get("#uploadModalForm [data-original-index='6'] > a").click();
        cy.get("#uploadModalForm #file").attachFile("home.png");
        cy.get("#uploadModalForm .submit").click();

        // Due to a known issue with checking image sizes when in headless mode
        // The following code hss been wrapped in an if statement so it doesn't cause the
        // test to fail when ran headless.
        // check uploaded image matches baseline
        if (!Cypress.browser.isHeadless) {
            cy.get("#targetImage").matchImageSnapshot("home");
            cy.get("#deleteBtn").click();
        }
    });
});
