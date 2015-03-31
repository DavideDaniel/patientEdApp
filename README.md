# patientEdApp

Test run for project in Sails - needs to be refactored incorporating Backbone changes from dr+ello repo


User Stories
---

Users are consumers and admins are providers. We'll refer to them as such.
Both sides of the application will be single page. (backbone)
The log in and registration system itself will be a separate page.
    The splash page will provide a choice of consumer vs provider.

The provider will be able to register & log in as admin.
    The provider will be identified locally with name/email & oAuth (Trello).
        The provider will be able to access different cards pulled in from the Trello API.
The provider will be able to see different consumer records on their caseload (nav up top maybe)
The provider will be able to view each consumer as a single page.
    Each consumer record can be created, edited, updated or deleted by the provider.
    Each consumer record will have empty boards that the provider can add issues to.
        When ('clicked') each issue will populate the board with cards from the Trello API.
            Each record will be pulled in from Trello API of the provider (in the future - own Trello like app inside the provider login)


The consumer will be able to register & log in.
    Consumers will be identified locally with name/email/pw & additionally with oAuth (FB, Google).
The consumer will see their profile page (pic/no pic?).
	Their profile page will have a list of current issues assigned by provider.
		Each issue will have boards assigned to them by the providers that the consumer can see.
            Each board will have cards that will be accessible (like Pinterest)
                Each card will have a 'Helpful' or 'Not helpful' designation.
                    When ('clicked') these designations will notify the provider via view on provider side.
			Unclicked cars will ping the Twilio API (possibly polling daily or per provider settings) to send SMS messages to consumer cell.


Nice to have
---
Consumer profile page will have their prescriptions (if possible per HIPAA), any current issues.
        Consumer prescriptions will have reminders about refills. Span of usage - usage data in legibile font size(!)

Analytics for provider side - d3js

Before launch - 
App will need security & encryption - HIPAA laws re security details for apps
