if(process.env.NODE_ENV === 'production'){
module.exports = { mongoURL:
'mongodb+srv://node_admin:nodejs@cluster0-fwmod.mongodb.net/test?retryWrites=true&w=majority'}
}else{
module.exports = { mongoURL:'mongodb://127.0.0.1:27017/vidjot-dev'}
}