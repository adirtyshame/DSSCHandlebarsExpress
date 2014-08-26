ko.bindingHandlers.fastClick = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        new FastButton(element, function() {
            valueAccessor()(viewModel, event);
        });
    }
};

var viewModel = {
    crafts: ko.observableArray(),
    manufacturers: ko.observableArray(),
    models: ko.observableArray(),
    classes: ko.observableArray(),
    selectedManufacturer: ko.observable(),
    selectedModel: ko.observable(),
    selectedClass: ko.observable()

};

viewModel.addCraft = function() {
    var post = {
        craft: viewModel.selectedModel(),
        class: viewModel.selectedClass()
    };
    $.post('/api/craft', post, function(result) {
        viewModel.reloadCrafts();
    });
};

viewModel.removeCraft = function(data) {
    $.ajax({
        url: '/api/craft',
        data: {id: data.craftId},
        type: 'DELETE',
        success: function(result) {
            viewModel.reloadCrafts();
        }
    });
};

viewModel.reloadCrafts = function() {
    $.getJSON('/api/crafts', function(result) {
        viewModel.crafts(result);
    });
};

viewModel.selectedManufacturer.subscribe(function(val) {
    $.getJSON('/api/models/' + val, function(result) {
        viewModel.models(result);
    });
});

$.getJSON('/api/manufacturers', function(result) {
    viewModel.manufacturers(result);
});

$.getJSON('/api/classes', function(result) {
    viewModel.classes(result);
});

viewModel.reloadCrafts();

ko.applyBindings(viewModel);