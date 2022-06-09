/// <reference types="Cypress" />
import booking from "../selectors/bookings";
import header from "../selectors/header";
import { Services } from "../pages/services";
import format from "date-fns/format";

const service = new Services();
export class Bookings {
    naviagateToBookingsTab() {
        cy.get(header.bookingsTab).click();
        cy.url().should("contain", "/bookings-dashboard");
    }

    clickAddBookingsButton() {
        cy.get(booking.addBookingButton).click();
        cy.get(booking.guestNameTextField).should("be.visible");
    }

    enterGuestName(guestName) {
        cy.get(booking.guestNameTextField).clear().type(guestName);
    }

    enterGuestEmail(guestEmail) {
        cy.get(booking.guestEmailTextField).clear().type(guestEmail);
    }

    enterGuestPhoneNumber(guestPhoneNumber) {
        cy.get(booking.guestPhoneTextField).clear().type(guestPhoneNumber);
    }

    enterNumberOfGuests(numberOfGuest) {
        cy.get(booking.numberOfGuestTextField).clear().type(numberOfGuest);
    }

    enterCheckInDate(checkInDate) {
        cy.get(booking.checkInDate).clear().type(format(checkInDate, "dd/MM/yyyy"));
    }

    enterCheckOutDate(checkOutDate) {
        cy.get(booking.checkOutDate).clear().type(format(checkOutDate, "dd/MM/yyyy"));
    }

    enterCheckInTime(checkInTime) {
        cy.get(booking.checkInTime).clear().type(checkInTime);
    }

    enterCheckOutTime(checkOutTime) {
        cy.get(booking.checkOutTime).clear().type(checkOutTime);
    }

    enterNetpayment(netPayment) {
        cy.get(booking.netPaymentTextField).clear().type(netPayment);
    }

    enterConfirmationCode(confirmationCode) {
        cy.get(booking.confirmationCodeTextField).clear().type(confirmationCode);
    }

    clickOnListingDropdownAndSelectListing(listing) {
        cy.get(booking.listingDropdown).click();
        cy.xpath(booking.listingOption.replace("option", listing)).click();
    }

    clickSaveButton() {
        cy.get(booking.saveButton).click();
    }

    enterBookingDetails(bookingInfo, checkInDate, checkOutDate) {
        service.selectTheProperty(bookingInfo.get("Property"));
        this.clickOnListingDropdownAndSelectListing(bookingInfo.get("Listing"));
        this.enterGuestName(bookingInfo.get("Guest"));
        this.enterGuestEmail(bookingInfo.get("Email"));
        this.enterGuestPhoneNumber(bookingInfo.get("Phone"));
        this.enterNumberOfGuests(bookingInfo.get("Number Of Guests"));
        this.enterCheckInDate(checkInDate);
        this.enterCheckOutDate(checkOutDate);
        this.enterCheckInTime(bookingInfo.get("Check-In Time"));
        this.enterCheckOutTime(bookingInfo.get("Check-Out Time"));
        this.enterNetpayment(bookingInfo.get("Net Payment"));
        this.enterConfirmationCode(bookingInfo.get("Confirmation Code"));
        service.enterNotes(bookingInfo.get("notes"));
    }

    verifyBookingDetails(bookingInfo) {
        cy.get("#information  div:nth-child(1)  table  tbody  tr").each((ele, index) => {
            cy.wrap(ele).find("td").eq(0).should("have.text", Array.from(bookingInfo.keys())[index]);
            cy.wrap(ele)
                .find("td")
                .eq(1)
                .should("contain", bookingInfo.get(Array.from(bookingInfo.keys())[index]));
        });
    }

    verifyCheckInAndCheckOutTiming() {
        cy.xpath('//td[text()="Check-In Time"]/following-sibling::td').should("have.text", "10:20");
        cy.xpath('//td[text()="Check-Out Time"]/following-sibling::td').should("have.text", "12:20");
    }

    clickOnJobs() {
        cy.get(booking.jobsTab).should("be.visible").click();
        cy.xpath('//Strong[text()="Jobs"]').should("be.visible").click();
    }

    verifyJobs() {
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[1]').should("have.text", "Linen Supply").should("be.visible");
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[4]').should("have.text", "11:30 - 12:30").should("be.visible");
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[5]').should("have.text", "Available").should("be.visible");
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[7]')
            .should("have.text", "Cleaning, Consumables, Linen Delivery")
            .should("be.visible");
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[10]').should("have.text", "11:30 - 12:30").should("be.visible");
        cy.xpath('(//*[@id="jobs"]/table/tbody/tr/td)[11]').should("have.text", "Available").should("be.visible");
    }

    clickOnProcessesTab() {
        cy.get(booking.processesTab).click();
        cy.xpath('//Strong[text()="Automatic Processes"]').should("be.visible");
    }

    verifyProcess() {
        const processes = [
            "Guest Documents Email",
            "Guest Documents Follow-Up",
            "Keysafe Code",
            "Cleaning Review",
            "Check-Out Message",
            "Guest Review",
        ];
        for (let i = 0; i <= 5; i++) {
            cy.xpath('//span[text()="process"]'.replace("process", processes[i])).should("be.visible");
        }
    }

    clickOnPaymentsTab() {
        cy.get(booking.paymentsTab).should("be.visible").click();
        cy.xpath('//Strong[text()="Payments"]').should("be.visible");
    }

    verifyPayments(checkOutDateFormat, bookingInfo) {
        let payment = bookingInfo.get("Net Payment");
        let managementFee = (20 / 100) * payment;
        cy.xpath('//div[@id="payments"]//table//tbody/tr/td[text()="Cleaning Fee"]/following-sibling::td[1]').should(
            "contain",
            checkOutDateFormat
        );
        cy.xpath('//div[@id="payments"]//table//tbody/tr/td[text()="Cleaning Fee"]/following-sibling::td[2]').should(
            "contain",
            "£5"
        );
        cy.xpath('//div[@id="payments"]//table//tbody/tr/td[text()="Management Fee"]/following-sibling::td[1]').should(
            "contain",
            checkOutDateFormat
        );
        cy.xpath('//div[@id="payments"]//table//tbody/tr/td[text()="Management Fee"]/following-sibling::td[2]').should(
            "contain",
            managementFee
        );
    }

    clickOnMessages() {
        cy.get(booking.messagesTab).click();
    }

    clickOnEditBookingDetailsButton() {
        cy.get(booking.editBookingButton).should("be.visible").click();
        cy.url().should("contain", "/update");
    }

    editBookingDetails(
        guestName,
        guestEmail,
        guestPhoneNumber,
        numberOfGuest,
        checkInDate,
        checkOutDate,
        checkInTime,
        checkOutTime,
        netPayment,
        confirmationCode,
        notes
    ) {
        this.enterGuestName(guestName);
        this.enterGuestEmail(guestEmail);
        this.enterGuestPhoneNumber(guestPhoneNumber);
        this.enterNumberOfGuests(numberOfGuest);
        this.enterCheckInDate(checkInDate);
        this.enterCheckOutDate(checkOutDate);
        this.enterCheckInTime(checkInTime);
        this.enterCheckOutTime(checkOutTime);
        this.enterNetpayment(netPayment);
        this.enterConfirmationCode(confirmationCode);
        service.enterNotes(notes);
    }

    clickOnCancelbookingButton() {
        cy.get(booking.cancelBookingButton).click();
        cy.url().should("contain", "/cancel");
    }

    enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime) {
        cy.get(booking.paymentAmount).select(paymentAmount);
        cy.get(booking.cancellationDate).type(format(cancellationDate, "dd/MM/yyyy"));
        cy.get(booking.cancellationTime).type(cancellationTime);
    }

    verifyBookingCancelled() {
        cy.get(booking.bookingCancelledMessage).should("have.text", "BOOKING CANCELLED");
    }

    enterCleaningFee(cleaningFee) {
        cy.get(booking.cleaningFeeTextField).clear().type(cleaningFee);
    }

    enterManagemantFee(managementFee) {
        cy.get(booking.managementFeeTextField).clear().type(managementFee);
    }

    enterByoBookingDetails(
        guestName,
        guestEmail,
        guestPhoneNumber,
        numberOfGuest,
        checkInDate,
        checkOutDate,
        checkInTime,
        checkOutTime,
        netPayment,
        cleaningFee,
        managemantFee,
        notes
    ) {
        this.enterGuestName(guestName);
        this.enterGuestEmail(guestEmail);
        this.enterGuestPhoneNumber(guestPhoneNumber);
        this.enterNumberOfGuests(numberOfGuest);
        this.enterCheckInDate(checkInDate);
        this.enterCheckOutDate(checkOutDate);
        this.enterCheckInTime(checkInTime);
        this.enterCheckOutTime(checkOutTime);
        this.enterNetpayment(netPayment);
        this.enterCleaningFee(cleaningFee);
        this.enterManagemantFee(managemantFee);
        service.enterNotes(notes);
    }

    verifyByoBookingDetails(
        guestName,
        guestEmail,
        guestPhoneNumber,
        checkInDate,
        checkOutDate,
        managementFee,
        cleaningFee
    ) {
        cy.xpath('//td[text()="Guest"]//following-sibling::td').should("have.text", guestName);
        cy.xpath('//td[text()="Email"]//following-sibling::td').should("have.text", guestEmail);
        cy.xpath('//td[text()="Phone"]//following-sibling::td').should("have.text", guestPhoneNumber);
        cy.xpath('//td[text()="Check-In Date"]//following-sibling::td').should("have.text", checkInDate);
        cy.xpath('//td[text()="Check-Out Date"]//following-sibling::td').should("have.text", checkOutDate);
        cy.xpath('//td[text()="Mgmt Charge"]//following-sibling::td').should("contain", managementFee);
        this.verifyCheckInAndCheckOutTiming();
        this.clickOnPaymentsTab();
        cy.xpath('(//td[text()="Cleaning Fee"]//following-sibling::td)[2]').should("contain", cleaningFee);
    }
    clickViewButton() {
        cy.xpath('(//a[@data-test="booking_view_button"])[1]').click();
    }
}
