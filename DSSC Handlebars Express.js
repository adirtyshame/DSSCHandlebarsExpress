var solrClient = require('solr-client').createClient('search05', '8983', 'article', '/solr'),
    express = require('express'),
    MongoStore = require('connect-mongo')(express),
    app = express();

//var solrClient = solr.createClient('search05', '8983', 'article', '/solr');

// Lucene query
var query2 = solrClient.createQuery()
                        .q({articleno: 'S6-06*'})
                        .start(0)
                        .rows(10);
                
                
                
app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/sessions'
    }),
    secret: '1234567890QWERTY'})
);

app.get('/search', function(req, res) {
    
});

solrClient.search(query2, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log('Found '+result.response.numFound+' entries:');
        result.response.docs.forEach(function(doc){
            console.log(JSON.stringify(doc));
        });
    }
});
