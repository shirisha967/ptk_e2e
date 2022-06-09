/// <reference types="Cypress" />
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

describe("Create a photography job to test invoice preview", () => {
    const testPropertyName = Cypress.env("e2e_test_property_name");

    /* The reason why we are using beforeEach and afterEach is in case
       we need to rerun the tests. This allows us to log out and back in for
       each attempt.
     */

    beforeEach("Log into Connect", () => {
        // Ensure there are no orphaned jobs
        cy.cleanUpOrphanedJobs();

        // Log into Connect
        cy.beforeConnect();
    });

    afterEach("Log out of Connect", () => {
        // Log out of Connect
        cy.log("Log out of Connect");
        cy.logoutOfConnect();
    });

    it("Create a photography job", () => {
        // Add a month to today's date
        const dateInAMonth = addMonths(new Date(), 1);

        // Navigate to the services page by clicking the icon in the menu bar
        cy.get('[data-test="base-services"]').click();
        cy.url().should("contain", "/services");

        // Click Add job button
        cy.contains("button", "Add Job").click();

        // Click property dropdown
        cy.get("#div_id_property > .controls > .btn-group > .btn").click();

        // Get test property from list of properties
        cy.get("#div_id_property > .controls > .btn-group > .open > .bs-searchbox > .form-control").type(
            testPropertyName
        );
        cy.get(".dropdown-menu > .active > a").click();
        cy.get("#div_id_property > .controls > .btn-group > .btn").should("contain", testPropertyName);

        // Choose Photography service
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="9"] > a'
        ).click();
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();

        // Enter a date
        cy.get("#id_date").click().type(format(dateInAMonth, "dd/MM/yyyy"));

        // Job times
        cy.get("#id_start_time").click().type("10:00");
        cy.get("#id_end_time").click().type("12:00");

        // Choose a provider
        cy.wait(250);
        cy.get("#div_id_provider > .controls > .btn-group > .btn").click();
        cy.get("#div_id_provider > .controls > .btn-group > .open > .bs-searchbox > .form-control")
            // .click()
            .type("e2eTestProviderPhotography");
        cy.get("#div_id_provider > .controls > .btn-group > .open > .dropdown-menu > .active > a > .text").click();
        cy.wait(250);

        // becasue it is a photography job it will require a description
        cy.get("#id_notes").type("Photos please!");

        // Accept the job
        cy.get("#div_id_status > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_status > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
        ).click();

        cy.get("#invoice_preview > :nth-child(1)").click();

        // PROVIDER INVOICE

        // Make sure provider invoice is showing up
        cy.waitFor('[data-test="provider-invoice"]');
        cy.get('[data-test="provider-invoice"]').should("contain", "Provider Invoice");

        // Invoice shows the correct address
        cy.get(".separator > section > table > tbody > tr > :nth-child(2)").should("contain", testPropertyName);

        // Invoice shows correct date
        cy.get(".separator > section > table > tbody > tr > :nth-child(3)").should(
            "contain",
            format(dateInAMonth, "d MMM yy")
        );

        // Invoice shows correct amounts (cost, fee and total)
        cy.get('[data-test="provider-invoice-cost"]').should("contain", "110.00");
        cy.get('[data-test="provider-invoice-fee"]').should("contain", "10.00");
        cy.get('[data-test="provider-invoice-payment"]').should("contain", "100.00");
    });
});
