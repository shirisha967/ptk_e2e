/// <reference types="Cypress" />
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

/* Due to the fact that this test can often fall over, no matter how much hardening we do around the
   provider code, we now retry this test twice
*/
describe("Create a cleaning job to test invoice preview", () => {
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

    it("Create a cleaning job", () => {
        // Add a month to today's date
        const dateInAMonth = addMonths(new Date(), 1);

        // Navigate to the services page by clicking the icon in the menu bar
        cy.get('[data-test="base-services"]').click();
        cy.url().should("contain", "/services");

        // Click Add job button
        cy.contains("button", "Add Job").click();

        // Click property dropdown
        cy.get("#div_id_property > .controls > .btn-group > .btn").click();

        // Get E2E Test Property from list of properties
        cy.get("#div_id_property > .controls > .btn-group > .open > .bs-searchbox > .form-control").type(
            testPropertyName
        );
        cy.get(".dropdown-menu > .active > a").click();
        cy.get("#div_id_property > .controls > .btn-group > .btn").should("contain", testPropertyName);

        // Choose cleaning service
        cy.waitFor("#div_id_services > .controls > .btn-group > .btn");
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="0"] > a'
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
            .type("e2eTestProviderCleaningTasking");
        cy.get("#div_id_provider > .controls > .btn-group > .open > .dropdown-menu > .active > a > .text").click();
        cy.wait(250);

        // Accept the job
        cy.get("#div_id_status > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_status > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
        ).click();

        // CLIENT INVOICE

        // Check to make sure the invoice preview is now showing up
        cy.waitFor(":nth-child(1) > .align-center");
        cy.get('[data-test="client-invoice"]').contains("Client Invoice");

        // Check for cleaning in table
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(2)").should("contain", "Cleaning");

        // check for 2 hours in table
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(4)").should("contain", "2");

        // Hourly rate of £10
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(5)").should("contain", "10.00");

        // Job rate of £0
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(6)").should("contain", "0.00");

        // Charge excl VAT of £20.00
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(7)").should("contain", "20.00");

        // VAT of £0.00
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(8)").should("contain", "0.00");

        // Total £20.00
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(9)").should("contain", "20.00");

        // PROVIDER INVOICE

        // Make sure provider invoice is showing up
        cy.get('[data-test="provider-invoice"]').should("contain", "Provider Invoice");

        // Invoice shows the correct address
        cy.get(".separator > section > table > tbody > tr > :nth-child(2)").should("contain", testPropertyName);

        // Invoice shows correct date
        cy.get(".separator > section > table > tbody > tr > :nth-child(3)").should(
            "contain",
            format(dateInAMonth, "d MMM yy")
        );

        // Invoice shows correct amounts (cost, fee and total)
        cy.get(".separator > section > table > tbody > tr > :nth-child(7)").should("contain", "20.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(8)").should("contain", "0.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "20.00");

        // Add an hour to job end time to increase the cost of the job by £10
        cy.get("#id_end_time").click().type("13:00");

        // leave the end time field so it updates the invoices
        cy.get("#invoice_preview > :nth-child(1)").click();
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(4)").should("contain", "3");

        // Client Invoice Total should be £30
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(9)").should("contain", "30.00");
        // Provider Invoice total should now be £30
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "30.00");
    });
});
