/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 *          1: load everything
 *          2: load everything
 *          3: load everything
 *          4: load everything (with correct nav bar)
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 2: // place holder
        case 3:
            return 'business/level_2/customize_theme';
        default:
            return 'error';
    }
}

exports.get = function (req, res, next) {
    //Get the logo for the business of the currently logged in user
    req.db.get('businesses').findById(req.user[0].business, function (err, business) {
        if (err) {
            return next(err);
        }
        if (!business) {
            return next(new Error('Business not found for user: ' + req.user));
        }

        var page = getPage(req.user[0]);
        if (page == 'error') {
            res.render('error', {
                message: 'Page not found',
                error: '404'
            });
        }
        else {
            res.render(page, {
                message: req.flash('permission'),
                logo: business.logo,//"images/thumb/cow.png",
                bg: "images/bg.jpg"  // + business.style.bg
            });
        }
    });
};
