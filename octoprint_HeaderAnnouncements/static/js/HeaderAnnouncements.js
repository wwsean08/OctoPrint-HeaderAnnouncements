/*
 * View model for OctoPrint-HeaderAnnouncements
 *
 * Author: Sean Smith
 * License: MIT
 */
$(function () {
    function HeaderannouncementsViewModel(parameters) {
        let self = this;
        let announcement = document.getElementById('header_announcement')
        let navbar = document.getElementById('navbar')
        navbar.after(announcement)
        // self.settingsViewModel = parameters[0];
        // const msg = self.settingsViewModel.settings.plugins['HeaderAnnouncements'].announcementText
        // console.log(msg)

        // TODO: Implement your plugin's view model here.
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

let sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
let poll = (promiseFn, duration) => promiseFn().then(
    sleep(duration).then(() => poll(promiseFn, duration)))

document.addEventListener("DOMContentLoaded", function(event) {
    poll(() => new Promise(() => {
        let announcementContainer = document.getElementById('header_announcement')
        let announcement = document.getElementById('header_announcement_msg')
        let api = ""
        if (window.location.port !== "") {
            api = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/plugin/HeaderAnnouncements`
        } else {
            api = `${window.location.protocol}//${window.location.hostname}/api/plugin/HeaderAnnouncements`
        }
        fetch(api)
            .then(res => res.json())
            .then((out) => {
                if (announcement !== null) {
                    announcement.textContent = out.msg
                    if (out.msg === "") {
                        announcementContainer.style.display = "none"
                    } else {
                        announcementContainer.style.display = "flex"
                    }
                }
            }).catch(err => console.error(err));

    }), 60000)
});
