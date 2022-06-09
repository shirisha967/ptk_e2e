/// <reference types="Cypress" />
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

describe("Create a tasking job to test invoice preview", () => {
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

    it("Create a tasking job", () => {
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

        // Choose Tasking service
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="13"] > a'
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

        // Enter notes
        cy.get("#id_notes").type("It's a tasking job");
        // Enter justification notes
        cy.get("#id_expense_justification").type("It's justified");
        // Choose justification type
        cy.get("#div_id_expense_type > .controls > .btn-group > .btn").click();
        // Choose Misc
        cy.get(
            '#div_id_expense_type > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="8"] > a'
        ).click();
        // Enter an amount
        cy.get("#id_expense_disbursed_amount").type("20.00");
        cy.get("#id_notes").type("It's a tasking job").click();

        // Bring invoice into focus
        cy.waitFor("#invoice_preview > :nth-child(1)");
        cy.get("#invoice_preview > :nth-child(1)").click();

        // // CLIENT INVOICE

        // Check to make sure the invoice preview is now showing up
        cy.get('[data-test="client-invoice"]').should("contain", "Client Invoice");
        // Check for cleaning in table
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(2)").should("contain", "Maintenance");
        // check disbursed amount
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(5)").should("contain", "20.00");
        // check PTK Fee amount
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(6)").should("contain", "25.00");
        // VAT of £5.00 (on £25 Fee only, provider is not registered for VAT)
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(7)").should("contain", "5.00");
        // Total £50.00
        cy.get(":nth-child(1) > section > table > tbody > tr > :nth-child(8)").should("contain", "50.00");

        // PROVIDER INVOICE

        // Make sure provider invoice is showing up
        cy.get('[data-test="provider-invoice"]').should("contain", "Provider Invoice");

        // Invoice shows the correct address
        cy.waitFor(".separator > section > table > tbody > tr > :nth-child(2)");
        cy.get(".separator > section > table > tbody > tr > :nth-child(2)").should("contain", testPropertyName);

        // Invoice shows correct date
        cy.get(".separator > section > table > tbody > tr > :nth-child(3)").should(
            "contain",
            format(dateInAMonth, "d MMM yy")
        );

        // Invoice shows correct amounts (cost, fee and total)
        cy.get(".separator > section > table > tbody > tr > :nth-child(7)").should("contain", "18.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(8)").should("contain", "0.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "18.00");

        // Add an hour to job end time to increase the cost of the job by £10
        cy.get("#id_end_time").click().type("13:00");

        // leave the end time field so it updates the invoices
        cy.get("#invoice_preview > :nth-child(1)").click();

        // Invoice shows correct amounts (cost, fee and total)
        cy.get(".separator > section > table > tbody > tr > :nth-child(7)").should("contain", "27.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(8)").should("contain", "0.00");
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "27.00");
    });
});
