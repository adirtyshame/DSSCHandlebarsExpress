var windowURL = window.URL || window.webkitURL;

ko.bindingHandlers.file = {
    init: function(element, valueAccessor) {
        $(element).change(function() {
            var file = this.files[0];
            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
        });
    },

    update: function(element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();

        if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
            var oldUrl = bindings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            bindings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
            if (!file) {
                bindings.fileBinaryData(null);
            } else {
                var reader = new FileReader();
                reader.onload = function(e) {
                    bindings.fileBinaryData(e.target.result);
                };
                reader.readAsArrayBuffer(file);
            }
        }
    }
};

var viewModel = {
    driver: ko.observable(),
    imageFile: ko.observable(),
    imageObjectURL: ko.observable(),
    imageBinary: ko.observable()
};

viewModel.loadDriver = function() {
    $.get('/api/driver', function(user) {
        viewModel.driver(user);
    });
};

viewModel.loadDriver();

ko.applyBindings(viewModel);