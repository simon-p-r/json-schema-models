'use strict';
print('Dropping collection');
print('Dropping old indexes');
db.test.dropIndexes();
db.example.dropIndexes();
db.dropDatabase();
