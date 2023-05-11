import UserValidator from "App/Validators/UserValidator";
import User from "App/Models/User";

class AuthController {
  public async register({ request, response }) {
    try {
      const { email, password } = await request.validate(UserValidator);

      if (email === "undefined") {
        throw { code: "Field_Undefined", field: "email" };
      } else if (password === "undefined") {
        throw { code: "Field_Undefined", field: "password" };
      } else {
        const user = await User.create({
          email,
          password,
        });

        return response.status(201).json(user);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async login({ request, response, auth }) {
    const email = request.input("email");
    const password = request.input("password");

    if (
      email === undefined ||
      password === undefined ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return response.status(400).json({
        message: "email and password required",
        timestamp: new Date(),
      });
    } else {
      const token = await auth
        .use("api")
        .attempt(email.toLowerCase(), password, {
          expiresIn: "10 days",
        });
      return token.toJSON();
    }
  }

  public async logout({ response, auth }) {
    await auth.use("api").revoke();
    response.status(200).json({
      message: "Logout successful",
    });
  }
}
export default AuthController;
