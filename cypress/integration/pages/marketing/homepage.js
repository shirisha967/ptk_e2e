import homepage from "../../selectors/marketing/homepage";

export class Homepage {
    verifyBookYourStayButtonShowing() {
        cy.get(homepage.bookYourStayButton).should("be.visible");
    }
}
