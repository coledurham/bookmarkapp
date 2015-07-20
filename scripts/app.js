var app = angular
    .module('bookmarkapp', ['LocalStorageModule'])
    .config(function(localStorageServiceProvider){
      localStorageServiceProvider
          .setPrefix('bookmarkapp')
          .setStorageType('localStorage')
          .setStorageCookie('30', '/')
          .setNotify(true, true);
    });

app.constant('RESOURCE_TYPES', {'book': 'book', 'url': 'url', 'film': 'film'});

app.controller('AppCtrl', ['$scope', 'RESOURCE_TYPES', 'localStorageService', function ($scope, RESOURCE_TYPES, localStorageService) {

    function generateTypesOptions(){
        var options = [];

        for(var index in RESOURCE_TYPES){
            options.push({'name': index, 'value': RESOURCE_TYPES[index]});
        }

        return options;
    };

    function sanitizeLogin(user){
        var simpleRegex = /^[a-zA-Z0-9 ]/ig;

        if(!user || user == ' ' || !simpleRegex.test(user)){
            return null;
        }

        return user.replace(' ', '_').toLowerCase();
    };

    function hideEditRow(row){
        var inputs = row.find('input[type="text"]'),
            selects = row.find('select'),
            display = row.find('span');

        inputs.attr('type', 'hidden');
        selects.addClass('hidden');
        display.removeClass('hidden');
    };

    function serializeData(table){
        var rows = table.find('tbody tr'),
            data = null;

        if(rows){
            data = [];

            rows.each(function(){
                var el = $(this),
                    type = el.find('.resource-type').val(),
                    url = el.find('.resource-url').val(),
                    name = el.find('.resource-name').val();

                data.push({'name': name, 'url': url, 'type': type});
            });
        }

        return data;
    };

    var _userKey = null;

    $scope.editRow = function(ev){
        
        var el = $(ev.currentTarget),
            lastRow = el.closest('tr');

        el.addClass('.edit').addClass('hidden');
        el.siblings('.save').removeClass('hidden');
        lastRow.find('span').addClass('hidden');
        lastRow.find('select').removeAttr('hidden').removeClass('hidden');
        lastRow.find('input[type="hidden"]').attr('type', 'text');
    };

    $scope.addRow = function(ev){

        $scope.userData = $scope.userData || [];

        $scope.userData.push({'type': RESOURCE_TYPES.url,
            'url': '',
            'location': '',
            'name': ''});
    };

    $scope.deleteRow = function(ev){
        var el = $(ev.currentTarget).closest('tr'),
            table = el.closest('table'),
            data = null;

        el.remove();

        data = serializeData(table);

        if(data){
            localStorageService.set('bookmark-data-' + _userKey, JSON.stringify(data));

            $scope.userData = data;
        }
    };

    $scope.getData = function(userKey){

        var data = localStorageService.get('bookmark-data-' + userKey),
            parsedData = null;

        if(data){
            try{
                parsedData = JSON.parse(data);
            }
            catch(err){}
        }

        return parsedData;
    };

    $scope.saveData = function(ev){

        var row = $(ev.currentTarget).closest('tr'),
            table = row.closest('table'),
            data = null;

        data = serializeData(table);

        if(data){
            localStorageService.set('bookmark-data-' + _userKey, JSON.stringify(data));

            $scope.userData = data;
        }
    };

    $scope.clearAll = function(ev){
        $scope.userData = null;
        localStorageService.set('bookmark-data-' + _userKey, '');
    }

    $scope.login = function(ev){

        ev && ev.preventDefault();

        var el = $(ev.currentTarget),
            login = el.siblings('input[type="text"]'),
            defaultLogin = login.data('default-value'),
            user = null,
            userKey = null,
            data = null;

        user = login.val();
        userKey = sanitizeLogin(user);

        if(!user || !userKey || user == defaultLogin){
            login.addClass('error');
            return;
        }

        $scope.user = _userKey = user;
        
        data = $scope.getData(userKey);

        if(data){
            $scope.userData = data;
        }
    };
    
    $scope.user = null;
    $scope.userData = null;

    $scope.typeOptions = generateTypesOptions();    
}]);