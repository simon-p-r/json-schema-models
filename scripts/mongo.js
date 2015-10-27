print('Dropping collection');
print('Dropping old indexes');
db.test.dropIndexes();
db.example.dropIndexes();
print('Creating index');
db.dropDatabase();
