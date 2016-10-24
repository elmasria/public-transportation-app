(function () {
    'use strict';

    angular.module('public-transportation-app')
    .factory('indexDB', ['constants', indexDB]);

    function indexDB(constants) {

        var DB = function () {
            var self = this;
            self.name = constants.INDEXDB_NAME;
            self.dbPromise = self._init();
        };

        DB.prototype._init = function () {
            var self = this;
            return idb.open(self.name, 1, function (upgradeDb) {
                switch (upgradeDb.oldVersion) {
                    case 0:
                        var store = upgradeDb.createObjectStore('tripSchedule', {
                            keyPath: 'tripID'
                        });
                        store.createIndex('by-date', 'createdDate');
                }
            })
        };

        DB.prototype._addTrip = function (trip) {
            var self = this;
            self.dbPromise.then(function (db) {
                if (!db) return;

                var tx = db.transaction('tripSchedule', 'readwrite');
                var store = tx.objectStore('tripSchedule');
                store.put(trip);

                store.index('by-date').openCursor(null,'prev').then(function(cursor) {
                    return cursor.advance(1);
                }).then(function deleteRest(cursor) {
                    if (!cursor) return;
                    cursor.delete();
                    return cursor.continue().then(deleteRest);
                });

            });
        };


        DB.prototype.getLocalTrip = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.dbPromise.then(function (db) {
                    // if we're already showing posts, eg shift-refresh
                    // or the very first load, there's no point fetching
                    // posts from IDB
                    if (!db) reject('No Local Data');

                    var index = db.transaction('tripSchedule')
                      .objectStore('tripSchedule').index('by-date');

                    index.getAll().then(function (trip) {
                        resolve(trip.reverse());
                    });
                });

            });

        };

        return new DB();
    }
}());