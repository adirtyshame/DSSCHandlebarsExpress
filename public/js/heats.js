var points = ['25', '20', '16', '13', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

ko.bindingHandlers.modal = {
    init: function(element, valueAccessor) {
        $(element).modal({
            show: false
        });

        var value = valueAccessor();
        if (typeof value === 'function') {
            $(element).on('hide.bs.modal', function() {
                value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).modal("destroy");
        });

    },
    update: function(element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
};

ko.bindingHandlers.fastClick = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        new FastButton(element, function() {
            valueAccessor()(viewModel, event);
        });
    }
};

var viewModel = {
    heats: ko.observableArray([]),
    seasons: ko.observableArray(['Saison 2014', 'Saison 2013', 'Saison 2012', 'Saison 2011']),
    events: ko.observableArray([]),
    races: ko.observableArray([]),
    classes: ko.observableArray([]),
    loading: ko.observable(false),
    showDialog: ko.observable(false),
    selectedSeason: ko.observable(),
    selectedEvent: ko.observable(),
    selectedRace: ko.observable(),
    eventTitle: function() {
        return this.selectedEvent() ? this.selectedSeason() + ' - ' + this.selectedEvent().eventName : '';
    }

};

viewModel.submit = function() {
    alert('submit');
    viewModel.showDialog(false);
};

viewModel.heatsByClass = function(shortName) {
    var result = [];
    for (var i = 0; i < viewModel.heats().length; i++) {
        var heat = viewModel.heats()[i];
        if (heat.classShortName === shortName) {
            result.push(heat);
        }
    }
    return result;


};

viewModel.loadEvents = function() {
    $.getJSON('/api/' + viewModel.selectedSeason() + '/events', function(data) {
        viewModel.events(data);
        viewModel.selectedEvent(data[0]);
//        $.getJSON('/api/' + viewModel.selectedSeason() + '/' + viewModel.selectedEvent().eventName + '/classes', function(data) {
//            viewModel.classes(data);
//        });
    });
};

viewModel.loadRaces = function() {
    $.getJSON('/api/' + viewModel.selectedSeason() + '/' + viewModel.selectedEvent().eventName + '/races', function(data) {
        viewModel.races(data);
        viewModel.selectedRace(data[0]);
        $.getJSON('/api/' + viewModel.selectedSeason() + '/' + viewModel.selectedEvent().eventName + '/' + viewModel.selectedRace().raceName + '/classes', function(data) {
            viewModel.classes(data);
        });
    });
};

viewModel.loadResultHeats = function() {
    viewModel.loading(true);
    $.getJSON('/api/results/' + viewModel.selectedSeason() + '/' + viewModel.selectedEvent().eventName + '/' + viewModel.selectedRace().raceName, function(data) {
        viewModel.heats(data);
        viewModel.loading(false);
    });
};

viewModel.loadTrainingHeats = function() {
    viewModel.loading(true);
    viewModel.heats([]);
    $.getJSON('/api/training/' + viewModel.selectedSeason() + '/' + viewModel.selectedEvent().eventName, function(data) {
        viewModel.heats(data);
        viewModel.loading(false);
    });
};

viewModel.heatStatus = function(status) {
    switch (status) {
        case 'OK':
            return 'success';
        case 'CANCELED':
            return 'warning';
        case 'INVALID':
            return 'info';
        case 'EARLY':
            return 'danger';
        default:
            return '';
    }
};

ko.applyBindings(viewModel);

viewModel.loadEvents();


$('#reload').click(function() {
    $.getJSON('/api/heats/training', function(data) {
        viewModel.heats(data);
    });
});