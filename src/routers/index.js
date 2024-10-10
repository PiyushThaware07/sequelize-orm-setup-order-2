function configureRoutes(app){
    app.get("/",(req,res)=>res.send("Server Running..."));
    
}
module.exports = configureRoutes;