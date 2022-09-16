/*
 * View model for OctoPrint-HeaderAnnouncements
 *
 * Author: Sean Smith
 * License: MIT
 */
$(function () {
    function HeaderannouncementsViewModel(parameters) {
        let self = this
        const announcement = document.getElementById('header_announcement')
        const announcement_msg = document.getElementById('header_announcement_msg')
        const navbar = document.getElementById('navbar')
        navbar.after(announcement)

        self.settings = parameters[0]
        self.settings.onStartupComplete = function () {
            const text = self.settings.settings.plugins.HeaderAnnouncements.announcementText()
            if (text !== "") {
                announcement_msg.textContent = text
                announcement.style.display = "flex"
            }
        }

        self.onDataUpdaterPluginMessage = function (plugin, data) {
            if (plugin !== "HeaderAnnouncements") {
                return
            }
            console.log(data)
            const text = data.announcementText
            announcement_msg.textContent = text
            if (text !== "") {
                announcement.style.display = "flex"
            } else {
                announcement.style.display = "none"
            }
        }
    }

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: HeaderannouncementsViewModel,
        // ViewModels your plugin depends on, e.g. loginStateViewModel, settingsViewModel, ...
        dependencies: ["settingsViewModel"],
        // Elements to bind to, e.g. #settings_plugin_HeaderAnnouncements, #tab_plugin_HeaderAnnouncements, ...
        elements: [ /* ... */]
    });
});
