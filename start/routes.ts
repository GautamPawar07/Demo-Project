import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return "Welcome to Demo API";
});

Route.post("/register", "AuthController.register");

Route.post("/login", "AuthController.login");

Route.group(() => {
  Route.post("/logout", "AuthController.logout");

  Route.group(() => {
    Route.post("/", "ProfilesController.createProfile");
    Route.delete("/:mobile", "ProfilesController.deleteProfile");
    Route.put("/", "ProfilesController.updateProfile");
    Route.get("/", "ProfilesController.getProfile");
  }).prefix("/user/profile");
}).middleware(["auth"]);
