import { Property } from "../pages/property";
import { Bookings } from "../pages/bookings";
import { Calendar } from "../pages/portal/calendar";
import { Dashboard } from "../pages/portal/dashboard";
import { Booking } from "../pages/portal/bookings";
import login from "../selectors/login";
import portallogin from "../selectors/portal/login";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

const property = new Property();
const bookings = new Bookings();
const calendar = new Calendar();
const dashboard = new Dashboard();
const booking = new Booking();
let propertyId = " ";

describe("Verify booking showing on dashboard, calendar, bookings tab", () => {
    const user = "e2e-test-client+1646814996722@example.com";
    const pass = "nh,4U563/XV8V?t_";
    const portalUrl = Cypress.env("portalUrl");
    const connectUrl = Cypress.env("connectUrl");

    before(() => {
        cy.loginToAdmin();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
    });

    beforeEach(() => {
        cy.loginToConnectAsGuestUser();
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnPropertyCalendarTab();
    });

    it("verify booking showing on client portal", () => {
        //Add BYO Booking
        property.clickAddByoBookingButton();
        let guestName = "Test";
        let numberOfGuest = 4;
        let guestEmail = "Test@gmail.com";
        let guestPhoneNumber = "01632 960123";
        let checkInDate = addDays(new Date(), 2);
        let checkOutDate = addDays(new Date(), 4);
        let checkInTime = "10:20";
        let checkOutTime = "12:20";
        let netPayment = "1";
        let cleaningFee = "9";
        let managemantFee = "2";
        let notes = "Test Booking";
        bookings.enterByoBookingDetails(
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
        );
        bookings.clickSaveButton();

        cy.logoutOfConnect();

        //Loginto client portal
        cy.forceVisitAndLogin(
            portalUrl,
            portallogin.usernameTxtBx,
            user,
            portallogin.passwordTxtBx,
            pass,
            portallogin.loginBtn
        );

        //Go to Dashboard
        dashboard.clickOnDashboardTab();

        //Verify booking dates on dashboard
        const checkInDateFormat = format(checkInDate, "MMM d yyyy");
        const checkOutDateFormat = format(checkOutDate, "MMM d yyyy");
        const checkInDateDay = checkInDateFormat.split(" ")[1];
        const checkInDateMonth = checkInDateFormat.split(" ")[0];
        const checkOutDateDay = checkOutDateFormat.split(" ")[1];
        const checkOutDateMonth = checkOutDateFormat.split(" ")[0];
        dashboard.verifyBookingDatesOnDashboard(checkInDateDay, checkInDateMonth, checkOutDateDay, checkOutDateMonth);

        //Click on calendar tab
        calendar.clickOnCalendarTab();

        //Verify booking showing on calendar
        calendar.verifyBookingShowingOnCalendar(guestName);

        //Go to Booking tab
        booking.clickOnBookingsTab();

        //verify booking showing on upcoming bookings
        booking.verifyBookingDetails(format(checkInDate, "d/M/yy"), format(checkOutDate, "d/M/yy"), guestName);

        //logout from the portal
        cy.logoutOfPortal();

        //log into connect to navigate to the booking
        cy.forceVisitAndLogin(
            connectUrl,
            login.usernameTxtBx,
            Cypress.env("connect_gst_user"),
            login.passwordTxtBx,
            Cypress.env("connect_gst_password"),
            login.loginBtn
        );
        cy.visit(connectUrl + "/bookings/");
        bookings.clickViewButton();

        //Cancel Booking
        const paymentAmount = "100%";
        const cancellationDate = addDays(new Date(), 1);
        const cancellationTime = "11:20";
        bookings.clickOnCancelbookingButton();
        bookings.enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime);
        bookings.clickSaveButton();
    });
});
