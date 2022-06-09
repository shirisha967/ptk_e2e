/// <reference types="cypress" />
import selectors from "../selectors/login";
import portallogin from "../selectors/portal/login";
const testdata = require("../../fixtures/data.json");

const connectUrl = Cypress.env("connectUrl");
//const user = Cypress.env("connect_staff_user");
//const password = Cypress.env("connect_staff_password");

export class Login {
    navigateToUrl() {
        cy.visit(connectUrl);
    }

    clickOnLogin() {
        cy.get(selectors.loginBtn).click();
    }

    loginToConnect(user = Cypress.env("connect_staff_user"), pass = Cypress.env("connect_staff_password")) {
        if (user !== "" || user !== undefined) {
            this.login(user, pass);
        }
    }

    verifyLoginErrorMessage(message) {
        cy.xpath(selectors.messageWhenSubmitInvalidCredentials).should("have.text", message);
    }

    enterUsername(username) {
        cy.xpath(selectors.usernameTxtBx).type(username).should("have.value", username);
    }

    enterPassword(password) {
        cy.xpath(selectors.passwordTxtBx).type(password).should("have.value", password);
    }

    login(user, pass) {
        this.enterUsername(user);
        this.enterPassword(pass);
        this.clickOnLogin();
    }

    loginToPortal(user = Cypress.env("portal_user"), pass = Cypress.env("portal_password")) {
        if (user !== "" || user !== undefined) {
            cy.xpath("(//input[@name='email'])[1]").type(user);
            cy.xpath("//input[@name='password']").type(pass);
            cy.get("#loginBtn").click();
            cy.url().should("include", "checklist");
        }
    }

    navigatingToInvoiceTabwithOldCredentials() {
        cy.get(portallogin.invoiceTab).find("span").should("have.text", "Invoices").click({ force: true });
        cy.url("should.be", "https://portal.ptkdev.co.uk/invoices/");
        cy.xpath(portallogin.message).contains("There are currently no invoices to be displayed.");
    }

    navigatingToInvoiceTabwithNewCredentials() {
        cy.get(portallogin.invoiceTab).find("span").should("have.text", "Invoices").click({ force: true });
        cy.url("should.be", "https://portal.ptkdev.co.uk/invoices/");
        cy.visit("https://portal.ptkdev.co.uk/invoices/", {
            onBeforeLoad(win) {
                cy.stub(win, "open");
            },
        });
        cy.xpath(portallogin.firstPdfButton).click();
        cy.window().its("open").should("be.called");
    }
}
