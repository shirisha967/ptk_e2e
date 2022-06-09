/// <reference types="Cypress" />
import { Homepage } from "../pages/marketing/homepage";

const homepage = new Homepage();

describe("Home page", () => {
    before(() => {
        cy.beforeMarketing();
    });
    it("Verify book your stay button showing on home page", () => {
        homepage.verifyBookYourStayButtonShowing();
    });
});
