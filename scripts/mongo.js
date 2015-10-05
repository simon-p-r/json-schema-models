print('Mongo version', version());
print('Dropping old indexes');
db.dummy.dropIndexes();
db.example.dropIndexes();
print('Creating index');
db.example.createIndex({ test: 1 }, { unique: true, background: true, w: 1 });
