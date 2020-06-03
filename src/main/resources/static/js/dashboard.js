function ApplicationModel(stompClient) {
  var self = this;

  self.username = ko.observable();
  self.serviceList = ko.observable(new ServicesModel());
  self.action = ko.observable(new ActionsModel(stompClient));
  self.notifications = ko.observableArray();

  self.connect = function () {
    stompClient.connect({}, function (frame) {

      self.username(frame.headers['user-name']);

      stompClient.subscribe("/app/providerList", function (message) {
        self.serviceList().loadServiceProviders(JSON.parse(message.body));
      });
      stompClient.subscribe("/topic/provider.id.*", function (message) {
        var state = JSON.parse(message.body);
        self.serviceList().processState(state);
      });
      stompClient.subscribe("/list/update/provider.id.*", function (message) {
        var provider = JSON.parse(message.body);
        self.pushNotification("Изменены свойства поставщика услуг " + provider.name);
        self.serviceList().updatePosition(provider);
      });
      stompClient.subscribe("/list/errors", function (message) {
        self.pushNotification("Error " + message.body);
      });
    }, function (error) {
      console.log("STOMP protocol error " + error);
    });
  }

  self.pushNotification = function (text) {
    self.notifications.unshift({notification: text});
    if (self.notifications().length > 10) {
      self.notifications.shift();
    }
  }

  self.logout = function () {
    stompClient.disconnect();
    window.location.href = "/logout";
  }
}

function ServicesModel() {
  var self = this;
  self.rows = ko.observableArray();
  var rowLookup = {};
  self.loadServiceProviders = function (service_providers) {
    for (var i = 0; i < service_providers.length; i++) {
      var row = new ServiceProviderRow(service_providers[i]);
      self.rows.push(row);
      rowLookup[service_providers[i].id] = row;
    }
  };

  self.processState = function (state) {
    if (rowLookup.hasOwnProperty(state.object.id) && state.object.active)
      rowLookup[state.object.id].updateState(state);
  };

  self.updatePosition = function (data) {
    rowLookup[data.id].enable(data.active);
    rowLookup[data.id].url(data.url);
    rowLookup[data.id].type(data.type);
    rowLookup[data.id].period(data.timeInterval);
  };
}
function ServiceProviderRow(data) {
  var self = this;
  self.id = data.id;
  self.company = data.name;
  self.url = ko.observable(data.url);
  self.type = ko.observable(data.type);
  self.period = ko.observable(data.timeInterval);
  self.enable = ko.observable(data.active);
  self.arrow = ko.observable();
  self.status = ko.observable(data.state);
  self.sustain = ko.observable();
  self.alive = ko.observable();
  self.note = ko.observable();
  self.updateState = function (state) {
    self.status(state.status);
    self.alive(state.alive);
    self.arrow("fa fa-1x fa-arrow-" + (state.alive ? 'up' : 'down'));
    self.sustain(getHH_MM_SS(state.timeFromLastStatus));
    if(state.alive) self.note(null);
    switch(state.notifierCounter){
      case 1: self.note('Персонал извещён'); break;
      case 2: self.note('Извещён повторно'); break;
    }
  };
}

function ActionsModel(stompClient) {
  var self = this;
  self.act = ko.observable();
  self.currentRow = ko.observable({});
  self.error = ko.observable('');
  self.suppressValidation = ko.observable(false);

  self.block = function (row) {
    self.showModal(row.enable() ? 'block': 'unblock', row)
  }
  self.edit = function (row) {
    self.showModal('edit', row)
  }

  self.showModal = function (action, row) {
    self.act(action);
    self.currentRow(row);
    self.suppressValidation(false);
    if(action=='edit')
      $('#update-dialog').modal();
    else
      $('#block-dialog').modal();
  }

  self.blockProvider = function () {
    stompClient.send("/app/block", {}, JSON.stringify(self.currentRow().id));
    $('#block-dialog').modal('hide');
  }

  self.updateProvider = function () {
    var serviceProvider = {
      "id" : self.currentRow().id,
      "url" : self.currentRow().url(),
      "type" : self.currentRow().type(),
      "timeInterval" : self.currentRow().period()
    };
    stompClient.send("/app/update", {}, JSON.stringify(serviceProvider));
    $('#update-dialog').modal('hide');
  }
}

function getHH_MM_SS(seconds) {
  var hours = parseInt(seconds / 3600) % 24;
  var minutes = parseInt(seconds / 60) % 60;
  var seconds = seconds % 60;
  return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}