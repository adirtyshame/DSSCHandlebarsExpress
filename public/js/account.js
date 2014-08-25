var viewModel = {
    driver: ko.observable()

};

viewModel.loadDriver = function() {
    $.get('/api/driver', function(user) {
        viewModel.driver(user);
    });
};

viewModel.loadDriver();

ko.applyBindings(viewModel);