print('Mongo version', version());
print('Dropping old indexes');
db.rec.dropIndexes();
print('Creating index');
db.dummy.createIndex({ test: 1 }, { unique: true, background: true, w: 1 });
