// Custom commands for our cypress tests
import "cypress-file-upload";
import "cypress-iframe";
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";
const path = require("path");

addMatchImageSnapshotCommand();

const marketingUrl = Cypress.env("marketingUrl");
const portalUrl = Cypress.env("portalUrl");
const connectUrl = Cypress.env("connectUrl");

Cypress.Commands.add("beforeMarketing", () => {
    // Clear the session - if ther eis one
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(marketingUrl);

    cy.reload();

    // Login

    const admin_login_user = Cypress.env("admin_login_user");

    if (admin_login_user !== "" || admin_login_user !== undefined) {
        cy.get("input[name=login]").type(admin_login_user);
        cy.get("input[name=password]").type(Cypress.env("admin_login_password"));
        cy.get("button").contains("Login").click();
    }
});

Cypress.Commands.add("uploadFile", (fileName, $uploader) => {
    cy.get($uploader).attachFile(fileName);
});

Cypress.Commands.add("beforePortal", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(portalUrl);

    // Login
    const user = Cypress.env("portal_user");
    const pass = Cypress.env("portal_password");
    if (user !== "" || user !== undefined) {
        cy.get(".mb-0").type(user);
        cy.get(":nth-child(2) > input").type(pass);
        cy.get("#loginBtn").click();
    }
});

Cypress.Commands.add("logoutOfPortal", () => {
    // Go to profile

    cy.get(".sidenav #Profile").click();

    // Click Log out
    cy.get(":nth-child(6) > .s12 > .row > .col > .btn").click();

    // Back at login?
    cy.url().should("contain", "/login");
});

function logInToConnect(user, password, redirect = "/") {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${connectUrl}/login/?next=${redirect}`);
    if (user !== "" || user !== undefined) {
        cy.get("#id_username").type(user);
        cy.get("#id_password").type(password);
        cy.get(".btn").click();
    }
}

Cypress.Commands.add("beforeConnect", (superuser = false, redirect = "/") => {
    let user, password;

    // Choose user to log in with
    if (!superuser) {
        user = Cypress.env("connect_staff_user");
        password = Cypress.env("connect_staff_password");
    } else {
        user = Cypress.env("connect_admin_user");
        password = Cypress.env("connect_admin_password");
    }

    logInToConnect(user, password, redirect);
});

Cypress.Commands.add("logoutOfConnect", () => {
    // Log out
    cy.get(".dropdown > .dropdown-toggle").should("be.visible").click({ force: true });
    cy.get(".dropdown-menu > li > a").contains("Logout").click({ force: true });
});

function createTestProperty() {
    const email = `e2e-test-client+${new Date().getTime()}@example.com`;
    const testPropertyName = Cypress.env("e2e_test_property_name");

    cy.visit(`${connectUrl}/onboarding/add/`);

    cy.get("#id_client_name").type("E2E Test Client");
    cy.get("#id_email").type(email);
    cy.get("#id_telephone").type("+44 20 7946 0623");
    cy.get("#id_property_name").type(testPropertyName);
    cy.get("#div_id_location > .controls > .btn-group > .btn").click();
    cy.get("#div_id_location > .controls > .btn-group > .open > .bs-searchbox > .form-control")
        .type("Edinburgh")
        .type("{enter}");
    cy.get("#id_postcode").type("EH1 3DG");
    cy.get("#id_address").type("St Andrews House, 2 Regent Rd, Edinburgh, EH1 3DG");
    cy.get("#div_id_check_in_model > .controls > .btn-group > .btn").click();
    cy.get(
        '#div_id_check_in_model > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
    ).click();
    cy.get("#div_id_package > .controls > .btn-group > .btn").click();
    cy.get(
        '#div_id_package > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a '
    ).click();
    cy.get("#id_management_charge").type("20");
    cy.get("#div_id_availability > .controls > .btn-group > .btn").click();
    cy.get(
        '#div_id_availability > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="0"] > a'
    ).click();
    cy.get("#id_long_let_value").type("2000");
    cy.get("#submit-save").click();

    // Add the platforms
    cy.visit(`${connectUrl}/admin/core/property/?q=0E2E+Test+Property`);
    cy.get(".field-__str__ > a").click();
    cy.get("#id_platforms").select(["Airbnb", "Bookingcom"]);
    cy.get(".default").click();

    cy.visit(`${connectUrl}/admin/core/property/?q=0E2E+Test+Property`);
}

//legacy create provider
const createNewProvider = () => {
    /* TODO: This function will need updating to use the new provider creation flow once
             it exists.
    */

    // Create a new provider
    cy.visit(`${connectUrl}/account/create/`);

    // Set a username and password
    cy.get("#id_username").type("e2eTestProvider");
    cy.get("#id_password").type("S0meStr0ngPassw0rd");

    // Name our provider
    cy.get("#id_name").type("E2E Provider");

    // Make our provider background checked
    cy.get("#div_id_background_checked > .controls > .btn-group > .btn").click();
    cy.waitFor("#div_id_background_checked > .controls > .btn-group > .open");
    cy.get(
        '#div_id_background_checked > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="0"] > a'
    ).click();

    cy.get("#div_id_type > .controls > .btn-group > .btn").click();
    cy.waitFor("#div_id_type > .controls > .btn-group > .open");
    cy.get('#div_id_type > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="2"] > a').click();

    // Set email and phone number
    cy.get("#id_email").type("e2etestprovider@example.com");
    cy.get("#id_telephone").type("0123 456 789");

    // Assign Edinburgh as the provider's location
    cy.get("#div_id_locations > .controls > .btn-group > .btn").click();
    cy.waitFor("#div_id_locations > .controls > .btn-group > .open");
    cy.get(
        '#div_id_locations > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="7"] > a'
    ).click();
    cy.get("#div_id_locations > .controls > .btn-group > .btn").click();

    // Bank info
    cy.get("#id_account_number").type("01234567");
    cy.get("#id_sort_code").type("123456");

    cy.get("#div_id_invoice_frequency > .controls > .btn-group > .btn").click();
    cy.waitFor("#div_id_invoice_frequency > .controls > .btn-group > .open");
    cy.get(
        '#div_id_invoice_frequency > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
    ).click();

    // Choose services
    cy.get("#div_id_services > .controls > .btn-group > .btn").click();
    cy.waitFor("#div_id_services > .controls > .btn-group > .open");
    cy.get(
        '#div_id_services > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="0"] > a'
    ).click();

    // Cleaning Service rates
    cy.waitFor("#delivery_section_for_service_2");
    cy.get("#id_cleaning_payment_per_hour").type("20");
    cy.get("#id_cleaning_payment_per_job").type("0");
    cy.get("#id_cleaning_payment_per_unit").type("0");
    cy.get("#id_cleaning_fee_per_hour").type("0");
    cy.get("#id_cleaning_fee_per_job").type("0");
    cy.get("#id_cleaning_fee_per_unit").type("0");

    /* TODO: Add in code to add the following rates
             Linen delivery service
        Linen supply service
        Photography service
        Tasking service
    */

    cy.get("#submit-save").click();
};

Cypress.Commands.add("loginToAdmin", () => {
    // Login as admin
    const user = Cypress.env("connect_admin_user");
    const password = Cypress.env("connect_admin_password");

    logInToConnect(user, password, encodeURI("/admin/"));
});

Cypress.Commands.add("logoutFromAdmin", () => {
    cy.visit(`${connectUrl}/admin/logout/`);
});

Cypress.Commands.add("ensureTestProperty", () => {
    const testPropertyName = Cypress.env("e2e_test_property_name").replace(" ", "+");

    return cy
        .visit(`${connectUrl}/admin/core/property/?q=` + testPropertyName)
        .get(".paginator")
        .then((el) => {
            if (el.text().includes("0 Properties")) {
                createTestProperty();
            }

            return cy
                .get(".field-__str__ > a")
                .invoke("attr", "href")
                .then((href) => {
                    //return cy.wrap(href.match(/.*\/property\/(\d+)\//)[1]);
                    return href.split("/")[4];
                });
        });
});

// This command ensures that the test property is always in a default state
Cypress.Commands.add("ensureDefaultValuesForTestProperty", () => {
    cy.visit(Cypress.env("connectUrl") + "/properties/" + Cypress.env("testPropertyId"));
    // Enter Edit Property
    cy.waitFor('[data-test="property-edit-property"]');
    cy.get('[data-test="property-edit-property"]').click();

    cy.get("#offboard_date").then(($offboardDate) => {
        if ($offboardDate.is(":visible")) {
            cy.get("#offboard_date").clear();
        }
    });

    // Clear offboard date field
    cy.get("#id_cleaning_time").focus().clear().type("60");
    cy.get("#id_deposit").focus().clear().type("100");
    cy.get("#id_cleaning_fee").focus().clear().type("5");
    cy.get("#id_short_address").focus().clear().type("St Andrews House, 2 Regent Rd, Edinburgh, EH1 3DG");
    cy.get('[id="submit-save"]').click();
});

Cypress.Commands.add("ensureNoListings", (propertyId, platform) => {
    // look for listings in admin

    cy.visit(`${connectUrl}/admin/core/listing/?q=${propertyId}`);
    cy.xpath("//a[text()='platform']".replace("platform", platform)).click();
    cy.get(".paginator").then((el) => {
        if (el.text().includes("0 listings")) {
            return;
        } else if (el.text().includes("1 listing")) {
        } else {
            throw Error("More that 1 listing found - please clean up manually");
        }

        // todo - listings
    });
});

Cypress.Commands.add("ensureNoAlias", (email) => {
    // look for listings in admin

    cy.visit(`${connectUrl}/admin/emailing/emailalias/?q=${email}`)
        .get(".paginator")
        .then((el) => {
            if (el.text().includes("0 email aliass")) {
                return;
            } else if (el.text().includes("1 email alias")) {
                cy.get(".action-select").click();
                cy.get('select[name="action"]').select("delete_selected");
                cy.get('#changelist-form button[type="submit"]').click();
                cy.get('input[type="submit"]').click();
            } else {
                throw Error("More that 1 email alias found - please clean up manually");
            }
        });
});

Cypress.Commands.add("ensureNoChannelAccount", (email) => {
    // look for listings in admin

    cy.visit(`${connectUrl}/admin/channel/channelaccount/?q=${email}`)
        .get(".paginator")
        .then((el) => {
            if (el.text().includes("0 Channel Accounts")) {
                return;
            } else if (el.text().includes("1 Channel Account")) {
                cy.get(".action-select").click();
                cy.get('select[name="action"]').select("delete_selected");
                cy.get('#changelist-form button[type="submit"]').click();
                cy.get('input[type="submit"]').click();
            } else {
                throw Error("More that 1 Channel Account found - please clean up manually");
            }
        });
});
//legacy provider command
Cypress.Commands.add("ensureThereIsAProvider", () => {
    // makes sure there is a provider

    // 1. Go to users in admin
    cy.visit(`${connectUrl}/admin/auth/user/?q=e2eTestProvider`);

    cy.get(".paginator").then((el) => {
        if (el.text().includes("0 users")) {
            createNewProvider();
        }
    });

    // If user does not exist then create one
});

Cypress.Commands.add("deleteMarketingTestClients", () => {
    /* Tidy up the created marketing test clients after our test
       has been run
    */
    cy.loginToAdmin();

    cy.visit(`${connectUrl}/admin/core/client/?q=e2eclient`);
    cy.get(".paginator").then((el) => {
        if (!el.text().includes("0 clients")) {
            cy.get(".action-checkbox-column > .text > span").click();
            cy.get("select").select("delete_selected");
            // click 'Go'
            cy.get(".button").click();
            // click delete
            cy.get('[type="submit"]').click();
        }
    });
    cy.logoutFromAdmin();
});

const createTestProvider = () => {
    //Navigate to add providers page
    cy.visit(`${connectUrl}/services/ng/providers/add`);

    //Wait for page to be loaded
    cy.waitFor("#name");

    //Type name
    cy.get("#name").type("aaaProviderTest");

    //Select provider type
    cy.get("#type").select("Freelance");

    //Type username
    cy.get("#username").type("TestProviderScript");

    //Type password
    cy.get("#password").type("password101");

    //Type confirm password
    cy.get("#confirmPassword").type("password101");

    //Type email
    cy.get("#email").type("test@testemail.com");

    //Type telephone
    cy.get("#telephone").type("00440000000000");

    //Add location
    cy.get(".selectize-input").click();
    cy.get('[data-value="Birmingham"]').click();
    //Make location dropdown go away
    cy.get("#telephone").click();

    //Type account number
    cy.get("#account_number").type("000000000");

    //Type sort code
    cy.get("#sort_code").type("000000");

    //Select invoice frequency
    cy.get("#invoice_frequency").select("Invoiced Monthly");

    //Tick hooked jobs only, job tracking, & background checked
    cy.get("label[for='hooked_jobs_only']").click();
    cy.get("label[for='disable_job_tracking']").click();
    cy.get("label[for='background_checked']").click();

    //Click add provider button
    cy.get("#addButton").click();

    //Check provider added successfully
    cy.get(".mrg-neg-5").should("contain", "providertest");
    cy.get(".status-active").should("contain", "Active");
};

const deleteTestProvider = () => {
    //Navigate to admin and search for the test provider
    cy.visit(`${connectUrl}/admin/auth/user/?q=TestProviderScript`);

    //Click the test provider
    cy.get(":nth-child(1) > .field-username > a").should("have.text", "TestProviderScript").click();

    //Click Delete button
    cy.waitFor(".deletelink");
    cy.get(".deletelink").click();

    //Confirm delete action
    cy.get('[type="submit"]').click();

    //Check to ensure the action was successful
    cy.get(".success").should("be.visible");
};

const navigateToTestProvider = () => {
    //Navigates to our test provider
    cy.visit(`${connectUrl}/services/#providers`);
    cy.waitFor("#providers-table > tbody > :nth-child(1) > .sorting_1");
    cy.get(":nth-child(1) > :nth-child(9) > .btn").click();
};

Cypress.Commands.add("ensureTestProviderExists", () => {
    // Creates a test provider
    providerExistence("true");
});

Cypress.Commands.add("cleanUpTestProvider", () => {
    // Deletes test provider once no longer needed
    providerExistence("false");
});

Cypress.Commands.add("loadTestProviderForTest", () => {
    // Ensures test provider exists then navigates to it
    cy.ensureTestProviderExists();
    navigateToTestProvider();
});

function providerExistence(action) {
    //Handles the test provider based on whether it exists or not

    cy.loginToAdmin();

    // Navigates to users in admin and searches for our test provider
    cy.visit(`${connectUrl}/admin/auth/user/?q=TestProviderScript`);

    // Checks for existence of test provider
    cy.get(".paginator").then((el) => {
        if (el.text().includes("0 users") && action == "true") {
            // If user doesn't exist then create it
            createTestProvider();
        }
        if (!el.text().includes("0 users") && action == "false") {
            // If user exists then delete it
            deleteTestProvider();
        }
    });
}

Cypress.Commands.add("cleanUpOrphanedJobs", () => {
    // Checks if there are any e2e jobs and if so deletes them
    cy.loginToAdmin();

    // Navigates to users in admin and searches for our test provider
    cy.visit(`${connectUrl}/admin/core/job/?q=e2e`);

    // Checks for existence of test provider
    cy.get(".paginator").then((el) => {
        if (!el.text().includes("0 jobs")) {
            // If e2e jobs exist, delete them
            cy.get("#action-toggle").click();
            cy.get("select").select("Delete selected jobs");
            cy.get(".button").click();
            cy.get('[type="submit"]').click();
            cy.get(".paginator").should("contain", "0 jobs");
        }
    });
});

// For use with the stripe iframe but can be used with any ohters in the future.
Cypress.Commands.add("iframeLoaded", { prevSubject: "element" }, ($iframe) => {
    const contentWindow = $iframe.prop("contentWindow");
    return new Promise((resolve) => {
        if (contentWindow && contentWindow.document.readyState === "complete") {
            resolve(contentWindow);
        } else {
            $iframe.on("load", () => {
                resolve(contentWindow);
            });
        }
    });
});

Cypress.Commands.add("getInDocument", { prevSubject: "document" }, (document, selector) =>
    Cypress.$(selector, document)
);

Cypress.Commands.add("getWithinIframe", (targetElement) =>
    cy.get("iframe").iframeLoaded().its("document").getInDocument(targetElement)
);
Cypress.Commands.add("loginToConnectAsGuestUser", (redirect = "/") => {
    // Login
    const user = Cypress.env("connect_gst_user");
    const password = Cypress.env("connect_gst_password");

    logInToConnect(user, password, redirect);
});

Cypress.Commands.add("verifyFileDownload", (fileName) => {
    // verify file downloaded
    const downloadsFolder = Cypress.config("downloadsFolder");
    const downloadedFilename = path.join(downloadsFolder, fileName);

    cy.readFile(downloadedFilename, "binary", { timeout: 60000 }).should((buffer) => expect(buffer.length).to.be.gt(0));
});

// Visit multiple domains in one test
Cypress.Commands.add("forceVisitAndLogin", (url, userNameTextBox, email, passwordTextBox, password, loginButton) => {
    cy.window().then((win) => {
        return win.open(url, "_self");
    });
    cy.xpath(userNameTextBox).type(email);
    cy.xpath(passwordTextBox).type(password);
    cy.get(loginButton).click();
});
