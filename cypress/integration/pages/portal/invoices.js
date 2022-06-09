import selectors from "../../selectors/portal/invoices";
export class Invoices {
    verifyNoInvoicesMessage() {
        cy.xpath(selectors.noInvoicesMessage).should("exist");
    }

    verifyPdfButtonFunctionality() {
        //Ref: https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-windowopen
        cy.window().then((win) => {
            cy.stub(win, "open").as("open");
        });
        cy.xpath('//button[text()="PDF"]').first().click();
        cy.get("@open").should("be.called");
    }
}
