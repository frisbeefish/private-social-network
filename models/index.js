
module.exports = {
    db : require('./db').db,
    CalendarEvent : require('./calendar_event'),
    CalendarEventAttendee : require('./calendar_event_attendee'),
    CalendarMonth : require('./calendar_month'),
    Community : require('./community'),
    Discussion : require('./discussion'),
    DiscussionComment : require('./discussion_comment'),
    DiscussionCategory : require('./discussion_category'),
    PostEntry : require('./post_entry'),
    PostEntryComment : require('./post_entry_comment'),
    Page : require('./page'),
    PagePost : require('./page_post'),
    PagePostSubelement : require('./page_post_subelement'),
    SubPage : require('./sub_page'),
    WebsiteMessage : require('./website_message'),
    WebsiteMessageFolder : require('./website_message_folder'),
    WebsiteMessageRecipient : require('./website_message_recipient')
}