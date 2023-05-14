import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

class ProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({trim:true}, [rules.minLength(3), rules.maxLength(30)]),

    mobile: schema.string({}, [
      rules.required(),
      rules.regex(/^[6-9]{10}$/),
      rules.minLength(10),
      rules.maxLength(10),
    ]),

    gender: schema.enum(["MALE", "FEMALE"], [rules.required()]),

    birthDate: schema.date({
      format: "dd-MM-yyyy",
    }),
  });

  public messages: CustomMessages = {
    "name.minLength": "Name must contain minimum 3 characters",

    "name.maxLength": "Name must contain maximum 30 characters",

    "mobile.required": "Mobile Number is required",

    "mobile.regex": "Mobile number must contain 10 digits ",

    "mobile.minLength": "Mobile number must contain 10 digits ",

    "mobile.maxLength": "Mobile number must contain 10 digits ",

    "gender.required": "gender in required",

    "birthDate.date": "date must be in  valid date format i.e : dd/MM/yyyy",
  };
}
export default ProfileValidator;
