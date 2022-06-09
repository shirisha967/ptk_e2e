import selectors from "../selectors/header";

export class Header {
    searchWith(text) {
        cy.get(selectors.searchInputTxtBx).type(text);
    }

    clickOnSearchBx() {
        cy.get(selectors.searchTxtBx).click();
    }

    verifySearchResults(text) {
        this.getSearchResultsCount().then((count) => {
            var searchResultsCount = count.split(" ")[0];
            for (var i = 1; i <= searchResultsCount; i++) {
                cy.get(selectors.highlightedSearchResults.replace("index", i)).each(($ele, index, elements) => {
                    cy.wrap($ele)
                        .text()
                        .then((highlightedText) => {
                            expect(highlightedText.toLowerCase()).to.equal(text.toLowerCase());
                        });
                });
            }
        });
    }

    verifyClientDetailsInSearchResults(clientName, clientEmail, clientPhoneNumber) {
        this.getSearchResultsCount().then((count) => {
            var searchResultsCount = count.split(" ")[0];
            for (var i = 1; i <= searchResultsCount; i++) {
                cy.get(selectors.searchResults.replace("index", i)).then(($searchResult) => {
                    if (
                        $searchResult.find("h2.title").text().includes(clientName) &&
                        $searchResult.find("span.pull-right").text().includes("Client")
                    ) {
                        var clientInfo = $searchResult.find("p.tag").text();
                        //expect(clientInfo).to.be.contains(clientEmail)
                        expect(clientInfo.split(",")[0].trim()).to.equal(clientName);
                        //expect(clientInfo.split(",")[1].trim()).to.equal(clientEmail);
                        expect(clientInfo.split(",")[2].trim()).to.equal(clientPhoneNumber);
                    }
                });
            }
        });
    }

    verifyPropertyDetailsInSearchResults(propertyName, propertyAddress) {
        this.getSearchResultsCount().then((count) => {
            var searchResultsCount = count.split(" ")[0];
            for (var i = 1; i <= searchResultsCount; i++) {
                cy.get(selectors.searchResults.replace("index", i)).then(($searchResult) => {
                    if (
                        $searchResult.find("h2.title").text().includes(propertyName) &&
                        $searchResult.find("span.pull-right").text().includes("Property")
                    ) {
                        var propertyInfo = $searchResult.find("p.tag").text();
                        expect(propertyInfo.trim()).to.contain(propertyAddress);
                    }
                });
            }
        });
    }

    getSearchResultsCount() {
        return cy.get(selectors.searchResultsCount).text();
    }

    clickOnServices() {
        cy.get(selectors.servicesTab).click();
    }
}
