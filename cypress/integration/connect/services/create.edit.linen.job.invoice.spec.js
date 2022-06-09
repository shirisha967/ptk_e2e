/// <reference types="Cypress" />
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

describe("Create and edit a linen job to test invoice preview", () => {
    // Add a month to today's date
    const dateInAMonth = addMonths(new Date(), 1);
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

    it("Create a cleaning and linen new job", () => {
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

        // Choose Cleaning, Linen delivery and Supply services
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="0"] > a'
        ).click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="4"] > a'
        ).click();
        cy.get(
            '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="5"] > a'
        ).click();
        cy.get("#div_id_services > .controls > .btn-group > .btn").click();

        // Enter a date
        cy.get("#id_date").click().type(format(dateInAMonth, "dd/MM/yyyy"));

        // Job times
        cy.get("#id_start_time").click().type("10:00");
        cy.get("#id_end_time").click().type("11:00");

        // Choose a provider
        cy.wait(250);
        cy.get("#div_id_provider > .controls > .btn-group > .btn").click();
        cy.get("#div_id_provider > .controls > .btn-group > .open > .bs-searchbox > .form-control")
            // .click()
            .type("e2eTestProviderLinen");
        cy.get("#div_id_provider > .controls > .btn-group > .open > .bs-searchbox > .form-control").click();
        cy.get("#div_id_provider > .controls > .btn-group > .open > .dropdown-menu > .active > a > .text").click();
        cy.wait(250);

        // Accept the job
        cy.get("#div_id_status > .controls > .btn-group > .btn").click();
        cy.get(
            '#div_id_status > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
        ).click();

        // Number of linen units
        cy.get("#id_linendelivery_units").click().type("3");

        // Move focus so the form will validate and load preview
        cy.get("#id_expense_justification").click();

        // Click invoice preview to bring it into focus
        cy.waitFor('[data-test="client-invoice"]');
        cy.get('[data-test="client-invoice"]').click();

        // CLIENT INVOICE

        // Check to make sure the invoice preview is now showing up
        cy.waitFor('[data-test="client-invoice"]');
        cy.get('[data-test="client-invoice"]').should("contain", "Client Invoice");

        // Check cleaning table/line
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(2)").should("contain", "Cleaning");
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(4)").should("contain", 1);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(5)").should("contain", 20.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(6)").should("contain", 0.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(7)").should("contain", 20.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(8)").should("contain", 0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(9)").should("contain", 20);

        // Check services table/line
        cy.get(":nth-child(3) > tbody > tr > :nth-child(2)").should("contain", "Linen");
        cy.get(":nth-child(3) > tbody > tr > :nth-child(4)").should("contain", "3");
        cy.get(":nth-child(3) > tbody > tr > :nth-child(5)").should("contain", 0.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(6)").should("contain", 5.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(8)").should("contain", 0.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(9)").should("contain", 5.0);

        // PROVIDER INVOICE

        // Make sure provider invoice is showing up
        cy.get('[data-test="provider-invoice"]').contains("Provider Invoice");

        // Invoice shows the correct address
        cy.waitFor(".separator > section > table > tbody > tr > :nth-child(2)");
        cy.get(".separator > section > table > tbody > tr > :nth-child(2)").should("contain", testPropertyName);

        // Invoice shows correct date
        cy.get(".separator > section > table > tbody > tr > :nth-child(3)").should(
            "contain",
            format(dateInAMonth, "d MMM yy")
        );

        // Invoice shows correct amounts (cost, fee and total)
        cy.get(".separator > section > table > tbody > tr > :nth-child(7)").should("contain", "56.50");
        cy.get(".separator > section > table > tbody > tr > :nth-child(8)").should("contain", "1.50");
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "55.00");

        // SAVE & AMEND JOB PHASE

        // Save Job
        cy.get("#submit-save").click();

        //
        // PART TWO - EDIT THE JOB WE JUST CREATED
        //

        // Make sure we are only looking at E2E jobs
        cy.get("#jobs_table_filter > label > .form-control").type(testPropertyName);

        // Click Edit
        cy.waitFor(":nth-child(1) > :nth-child(10) > .btn");
        cy.get(":nth-child(1) > :nth-child(10) > .btn").click();

        // Change job end time
        cy.get("#id_end_time").clear();
        cy.get("#id_end_time").type("13:00");

        // Change number of linen units to 5
        cy.get("#id_linendelivery_units").clear();
        cy.get("#id_linendelivery_units").type("5");

        cy.log("Scroll to the client invoice");
        // scroll to the invoice preview
        cy.wait(250);
        cy.get('[data-test="client-invoice"]').click();

        // Now check the invoices to make sure the values are updated to reflect the longer job time.

        // CLIENT INVOICE - RECHECK

        // Check to make sure the invoice preview is now showing up
        cy.get('[data-test="client-invoice"]').contains("Client Invoice");

        // Check cleaning table/line
        cy.waitFor(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(2)");
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(2)").should("contain", "Cleaning");
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(4)").should("contain", 3);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(5)").should("contain", 20.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(6)").should("contain", 0.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(7)").should("contain", 60.0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(8)").should("contain", 0);
        cy.get(":nth-child(1) > section > :nth-child(2) > tbody > tr > :nth-child(9)").should("contain", 60);

        // Check services table/line
        cy.get(":nth-child(3) > tbody > tr > :nth-child(2)").should("contain", "Linen");
        cy.get(":nth-child(3) > tbody > tr > :nth-child(4)").should("contain", 5);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(5)").should("contain", 0.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(6)").should("contain", 5.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(8)").should("contain", 0.0);
        cy.get(":nth-child(3) > tbody > tr > :nth-child(9)").should("contain", 5.0);

        // PROVIDER INVOICE - RECHECK

        // Make sure provider invoice is showing up
        cy.get('[data-test="provider-invoice"]').contains("Provider Invoice").click();

        // Invoice shows the correct address
        cy.waitFor(".separator > section > table > tbody > tr > :nth-child(2)");
        cy.get(".separator > section > table > tbody > tr > :nth-child(2)").should("contain", testPropertyName);

        // Invoice shows correct date
        cy.get(".separator > section > table > tbody > tr > :nth-child(3)").should(
            "contain",
            format(dateInAMonth, "d MMM yy")
        );

        // Invoice shows correct amounts (cost, fee and total)
        cy.get(".separator > section > table > tbody > tr > :nth-child(7)").should("contain", "117.50");
        cy.get(".separator > section > table > tbody > tr > :nth-child(8)").should("contain", "2.50");
        cy.get(".separator > section > table > tbody > tr > :nth-child(9)").should("contain", "115.00");

        // Delete job to keep things tidy
        cy.wait(250);
        cy.get("#submit-delete").click();

        // Wait to make sure the above delete completes
        cy.wait(250);
    });
});
