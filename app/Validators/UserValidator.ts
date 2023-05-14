import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.required(), rules.email()]),

    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(16),
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/),
    ]),
  });

  public messages: CustomMessages = {
    "email.required": "email address is required",

    "email.email": "Invalid email address",

    "password.minLength": "password must contain minimum 8 characters",

    "password.maxLength": "password must contain maximum 16 characters",

    "password.regex": "password must contain AlphaNumeric characters",
  };
}

export default UserValidator;
