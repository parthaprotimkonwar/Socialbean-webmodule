/**
 * Created by parthaprotimkonwar on 26/02/17.
 */

var ClientCustomization = angular.module('ClientCustomization', [])
    .service('ThemeText', function () {

        //allowed values : ALLIANZ, CHRIST_UNIVERSITY, CONNSOCIO
        //based on this value the email header logo will be updated
        this.CLIENT_ID = "ALLIANZ";

        //theme text for UI purpose
        this.CLIENT_NAME = "Allianz";
        this.LOGIN_HEADER_IMAGE_316x316 = "img/allianz-logo-small-login.png";
        this.INDEX_PAGE_LOGO_200x50 = "img/front-page-logo-small.png";
    });

