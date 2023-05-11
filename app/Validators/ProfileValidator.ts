import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

class ProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(30)]),

    mobileNumber: schema.string({}, [
      rules.required(),
      rules.regex(/^[0-9]{10}$/),
      rules.minLength(10),
      rules.maxLength(10),
    ]),

    gender: schema.enum(["MALE", "FEMALE"], [rules.required()]),

    dateOfBirth: schema.date({
      format: "dd-MM-yyyy",
    }),
  });

  public messages: CustomMessages = {
    "name.minLength": "Name must contain minimum 3 characters",

    "name.maxLength": "Name must contain maximum 30 characters",

    "mobileNumber.required": "Mobile Number is required",

    "mobileNumber.regex": "Mobile number must contain 10 digits ",

    "mobileNumber.minLength": "Mobile number must contain 10 digits ",

    "mobileNumber.maxLength": "Mobile number must contain 10 digits ",

    "gender.required": "gender in required",

    "dateOfBirth.date": "date must be in  valid date format i.e : dd/MM/yyyy",
  };
}
export default ProfileValidator;
