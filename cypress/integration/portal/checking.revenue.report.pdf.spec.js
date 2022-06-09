/// <reference types="Cypress" />
import { Login } from "../pages/login";
import { NavigationHelper } from "../helpers/navigationhelper";
import { Invoices } from "../pages/portal/invoices";

const login = new Login();
const navHelper = new NavigationHelper();
const invoices = new Invoices();

describe("checking revenue reports", () => {
    const portalUrl = Cypress.env("portalUrl");
    const oldUser = "e2e-test-client+1646814996722@example.com";
    const oldPass = "nh,4U563/XV8V?t_";
    const newUser = "tech+howard@passthekeys.co.uk";
    const newPass = "MrBean2021";

    beforeEach(() => {
        cy.visit(portalUrl);
    });

    it("verify revenue reports in invoice tab with old credentials", () => {
        login.loginToPortal(oldUser, oldPass);
        navHelper.navigateToPortalInvoices();

        invoices.verifyNoInvoicesMessage();
    });

    it("verify revenue reports in invoice tab with new credentials", () => {
        login.loginToPortal(newUser, newPass);
        navHelper.navigateToPortalInvoices();
        invoices.verifyPdfButtonFunctionality();
    });
});
