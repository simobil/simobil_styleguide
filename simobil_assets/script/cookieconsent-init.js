var pageName = "www.simobil.si";
var pageUrl = "http://www.simobil.si";

var lang = $('html').attr('lang').slice(0,2);
if(lang != 'sl' && lang != 'en') {
    lang = 'sl'
}

var strings = {};

switch(lang) {
    case 'sl':
        strings["analyticsDefaultTitle"] = "Analitični piškotki";
        strings["advertisingDefaultTitle"] = "Oglaševalski piškotki";
        strings["leftBoxMsg"] =  'Uporaba piškotkov na <br /><a href="'+pageUrl+'">'+pageName+'</a>';
        strings["privacySettingsDialogTitleB"] = 'na <a href="'+pageUrl+'">'+pageName+'</a>';
        break;
    case 'en':
        strings["analyticsDefaultTitle"] = "Analytics cookies";
        strings["advertisingDefaultTitle"] = "Advertising cookies";
        strings["leftBoxMsg"] =  'Privacy settings on <br /><a href="'+pageUrl+'/en">'+pageName+'</a>';
        strings["privacySettingsDialogTitleB"] = 'on <a href="'+pageUrl+'/en">'+pageName+'</a>';
        strings["notificationTitle"] = '' +
                'The purpose of the EU Directive on Privacy and Electronic ' +
                'Communications is to protect your privacy. Si.mobil\'s website ' +
                'uses text files called cookies, which keep track of the pages ' +
                'you visit and of what you do on these pages. This is used to ' +
                'support the website\'s operation, and is exclusively for our own analytics. ' +
                'For more information about cookies and how they are used on Si.mobil\'s websites, ' +
                'go to <a href="/en/inside.cp2?cid=C80CBFFF-3D80-6DED-D897-09CCA73B88E5&linkid=articles">About Cookies</a> or <a href="#" class="cc-modal-trigger">Cookie Settings</a>.' +
                '<br /><br />' +
                'If you accept the use of the cookies, click "I accept the settings", ' +
                'which means you agree that cookies may be set for analytics, personalization, ' +
                'advertising, and remarketing, as well as other third-party cookies, which can ' +
                'improve your user experience. If you click Close, or simply continue to browse ' +
                'the website, only those cookies will be set which are necessary for the website\'s ' +
                'operation and analytics, while personalization, advertising, remarketing, and ' +
                'other third-party cookies, required to improve the user experience, will be blocked.';
        strings["allowCookies"] = 'I accept the settings';
        strings["changeCookiePrefs"] = 'Change the cookie settings';
        strings["privacySettingsDialogSubtitle"] = 'You can change your decision regarding the acceptance of cookies on the links below.';
        strings["analyticsDefaultDescription"] = 'Cookies are used to improve user experience. They help us understand how visitors use our website, and this information helps us decide on how to adjust its content and functionalities, allowing us to display even more useful content.';
        strings["advertisingDefaultDescription"] = 'Cookies used to tailor advertising to individual users.';
        strings["preferenceConsent"] = 'I accept';
        strings["preferenceDecline"] = 'I do not accept the settings';
        strings["savePreference"] = 'Save changes';
        strings["cookieTitle"] = 'about cookies on Simobil.si';
        strings["closeWindow"] = 'Close';
        strings["privacySettings"] = 'Privacy settings';
        strings["privacySettingsDialogTitleA"] = 'Privacy settings';
        break;
}



cc.initialise({
   
    cookies: {
        analytics: {    //class="cc-onconsent-analytics"

        },
        advertising: {       //class="cc-onconsent-social"

        }
    },
    settings: {
    	refreshOnConsent: false,
        bannerPosition: "bottom",
        tagPosition: "vertical-left",
        style: "simobil",
        cookieApprovedExp: 365, //expiration days for approved cookies
        cookieNotApprovedExp: 180, //expiration days for not approved cookies ( <0: no cookie, ==0: session, >0: expiration days )
        hideprivacysettingstab: true
    },
    strings: strings
});

 $().ready(function(){
    $('#cc-modal-trigger, .cc-modal-trigger').click(function(e){
        e.preventDefault();
        cc.showmodal();
    });

    /* close notification */
    $(document).on('click','#cc-notification #cc-header .cc-close',function () {
        if(!cc.ismobile) {
        jQuery('#cc-notification').slideUp();
        }
        cc.reloadifnecessary();

    });

    window.onbeforeunload = function(){
        var setPrefs = true;
        $.each(cc.cookies, function(key, value) {
            if (cc.approved[key] == "yes"){
                setPrefs = false;
            }
        });
        if(setPrefs){
           cc.setcookie('ccrememberme', "false", cc.settings.cookieNotApprovedExp);
        }
    }
});

        