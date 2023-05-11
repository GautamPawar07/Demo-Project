import UserValidator from "App/Validators/UserValidator";
import User from "App/Models/User";

class AuthController {
  public async register({ request, response }) {
    try {
      const { email, password } = await request.validate(UserValidator);

      const user = await User.create({
        email,
        password,
      });

      return response.status(201).json(user);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  public async login({ request, response, auth }) {
    try {
      const { email, password } = await request.validate(UserValidator);

      const token = await auth
        .use("api")
        .attempt(email.toLowerCase(), password, {
          expiresIn: "10 days",
        });
      return token.toJSON();
    } catch (error) {
      return response.status(400).json(error);
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
